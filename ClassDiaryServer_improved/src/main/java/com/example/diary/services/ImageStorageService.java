package com.example.diary.services;

import com.example.diary.dto.ImageDTO;
import com.example.diary.models.Image;
import com.example.diary.models.Sclass;
import com.example.diary.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;
import java.util.Arrays;

@Service
public class ImageStorageService {

    @Autowired
    private ImageRepository imageRepository;

    private final Path root = Paths.get("src/main/resources/static/img");

    public void initRoot() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("A gyökérkönyvtár inicializációja sikertelen");
        }
    }

    public Image find(String uuid) {
        return imageRepository.findById(uuid).orElse(null);
    }

    public List<Image> findByFileName(String filename) {
        return imageRepository.findByFilenameContains(filename);
    }


    public Optional<Image> findByStoredName(String filename, String extension) {
        return imageRepository.findByFilenameAndExtension(filename, extension);
    }

    public Optional<String> findIdByStoredName(String filename, String extension) {
        return imageRepository.findIdByFilenameAndExtension(filename, extension);
    }

    @Transactional
    public void store(MultipartFile file, Optional<Sclass> sclass, String signature)
          throws IOException {

        String fileName = getFileName(file.getOriginalFilename())[0];
        String extension = getFileName(file.getOriginalFilename())[1];

        if (fileName == null || fileName.isBlank()) {
            fileName = "_";
        }

        Image image = new Image(signature, fileName, extension, file.getBytes());
        if (sclass.isPresent()) image.setSclass(sclass.get());

        try {
            validateImageFile(file, extension);
            Files.copy(file.getInputStream(), this.root.resolve(fileName + extension));
            imageRepository.save(image);
        } catch (FileAlreadyExistsException e) {
            int n = 1;

            while (Files.exists(root.resolve(fileName + "(" + n + ")" + extension))) {
                n++;
            }

            image.setFilename(fileName + "(" + n + ")");

            Files.copy(file.getInputStream(), this.root.resolve(fileName + "(" + n + ")" + extension));
            imageRepository.save(image);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    //Fájlok betöltése szerver oldali útvonal alapján
    public List<UrlResource> loadAll() throws IOException {
        try (Stream<Path> paths = Files.walk(this.root, 1)) {
            return paths
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        try {
                            return new UrlResource(path.toUri());
                        } catch (MalformedURLException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();
        }
    }

    public List<UrlResource> loadByTag(String tag) throws IOException {
        try (Stream<Path> paths = Files.walk(this.root, 1)) {
            return paths
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().trim().toLowerCase().contains(tag.trim().toLowerCase()))
                    .map(path -> {
                        try {
                            return new UrlResource(path.toUri());
                        } catch (MalformedURLException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();
        }
    }

    //Fájlok betöltése DB-bináris adatok alapján
    @Transactional
    public List<ImageDTO> getImageReasourceByFilename(String filename) throws IOException {
        List<ImageDTO> images = imageRepository.findDtosByName(filename);

        if (images.isEmpty()) {throw new RuntimeException("Érvénytelen fájlnév!");}
        return images;
    }

    public List<Image> getBySclass(Sclass sclass) {
        return imageRepository.findBySclass(sclass);
    }

    public List<ImageDTO> getImageResourcesBySclass(Sclass sclass) {
        return imageRepository.findDtosBySclass(sclass);
    }

    public List<ImageDTO> getImageResourcesIfNoClass() {

        return imageRepository.findDtosIfNoClass();
    }


    //Képfájl-szinkronizáció a útvonal és adattábla egyedei között
    @Transactional
    public String synchronize() throws IOException {
        List<Image> imgs = imageRepository.findAll();
        AtomicInteger create_number = new AtomicInteger();
        AtomicInteger remove_number = new AtomicInteger();
        List<String> messages = new ArrayList<>();

        for (Image img : imgs) {
            String storedName = img.getFilename() + img.getExtension();
            Path target = this.root.resolve(storedName);

            try {
                if (!Files.exists(target)) {
                    Files.write(
                            target,
                            img.getData(),
                            StandardOpenOption.CREATE
                    );
                    create_number.getAndIncrement();
                } else if (!compareBinaryContent(target, img)) {
                    Files.write(
                            target,
                            img.getData(),
                            StandardOpenOption.CREATE,
                            StandardOpenOption.TRUNCATE_EXISTING
                    );
                    create_number.getAndIncrement();
                }
            } catch (Exception e) {
                throw new RuntimeException("Hiba történt a fájlok szinkronizációja során!", e);
            }
        }

        try (Stream<Path> paths = Files.walk(this.root, 1)) {
            paths.filter(Files::isRegularFile)
                    .forEach(path -> {
                        String fileName = getFileName(path.getFileName().toString())[0];
                        String extension = getFileName(path.getFileName().toString())[1];

                        if (findByStoredName(fileName,extension).isEmpty()) {
                            try {
                                Files.deleteIfExists(path);
                                remove_number.getAndIncrement();
                            } catch (IOException e) {
                                throw new RuntimeException("Hiba történt a fájlok szinkronizációja során!");
                            }
                        }
                    });
        }

        if(create_number.get() == 0 && remove_number.get() == 0) {
            messages.add("Nem történt módosítás");
        } else{
            if (create_number.get() > 0) {messages.add(create_number.get() + " kép létrehozva a háttértárolóban!");}
            if (remove_number.get() > 0) {messages.add(remove_number.get() + " kép eltávolítva a háttértárolóból!");}
        }

        return String.join("; ", messages);
    }

    @Transactional
    public void delete(Image image) throws IOException {

        String storedName = image.getFilename() + image.getExtension();
        Path target = this.root.resolve(storedName);

        if (Files.exists(target)) {
            Files.delete(target);
            imageRepository.delete(image);
        }
    }

    @Transactional
    public void deleteAll() throws IOException {
        try (Stream<Path> paths = Files.walk(this.root, 1)) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException e) {
                    throw new RuntimeException("Képfájl törlése sikertelen!", e);
                }
            });
        }

        imageRepository.deleteAll();
    }

    private String[] getFileName(String filename) {
        int dotIndex = filename.lastIndexOf('.');

        String baseName;
        String extension;

        if (dotIndex == -1) {
            baseName = filename;
            extension = "";
        } else {
            baseName = filename.substring(0, dotIndex);
            extension = filename.substring(dotIndex);
        }

        return new String[]{baseName, extension};
    }

    private void validateImageFile(MultipartFile file, String extension) throws IOException {
        List<String> allowedTypes = List.of("image/png", "image/jpeg", "image/webp", "image/gif");
        List<String> allowedExtensions = List.of(".png", ".jpg", ".jpeg", ".webp", ".gif");

        if (file.isEmpty()) {
            throw new RuntimeException("Üres fájl!");
        }

        if (file.getContentType() == null || !allowedTypes.contains(file.getContentType())) {
            throw new RuntimeException("Nem támogatott fájltípus!");
        }

        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new RuntimeException("Nem támogatott kiterjesztés!");
        }
    }

    private boolean compareBinaryContent(Path path, Image image)
            throws IOException, NoSuchAlgorithmException {

        if (Files.size(path) != image.getData().length) {
            return false;
        }

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] pathContent = md.digest(Files.readAllBytes(path));
        byte[] storedContent = md.digest(image.getData());

        return Arrays.equals(pathContent, storedContent);
    }

}
