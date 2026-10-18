package com.example.diary.controllers;

import com.example.diary.Security.UserDetailsImpl;
import com.example.diary.dto.ImageDTO;
import com.example.diary.dto.ResponseFileDTO;
import com.example.diary.models.Image;
import com.example.diary.models.Sclass;
import com.example.diary.models.Student;
import com.example.diary.models.User;
import com.example.diary.repositories.ImageRepository;
import com.example.diary.services.ImageStorageService;
import com.example.diary.services.SclassService;
import com.example.diary.services.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/images")
public class ImageStorageController {

    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private SclassService classService;

    @Autowired
    private SclassService sclassService;

    @Autowired
    private UserService userService;

    @Autowired
    ModelMapper modelMapper;

    @GetMapping("/all")
    public ResponseEntity<?> getAllImages() {
        try {
            List<ResponseFileDTO> imageList = imageStorageService.loadAll().stream()
                    .filter(resource -> convertToResponseFileResource(resource) != null)
                    .map(resource -> convertToResponseFileResource(resource))
               .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK).body(imageList);
        } catch (IOException e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Hiba történt a képfájlok betöltáse során");
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/bin/{id}")
    public ResponseEntity<byte[]> getBinaryDataById(@PathVariable String id) {
        try {
            Image image = imageStorageService.find(id);
            byte[] data = image.getData();

            return ResponseEntity.ok().body(image.getData());
        } catch (RuntimeException e){
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable String id) {
        try {
            Image image = imageStorageService.find(id);
            ImageDTO imageDTO = convertToImageDTO(image);

            //Count the size of image
            long size = image.getData() != null ? (long) image.getData().length / 1024 : 0L;
            Map<String,Object> response = new HashMap<>();

            //Push each field of imageResource
            for (Field field : imageDTO.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                response.put(field.getName(), field.get(imageDTO));
            }

            response.put("size", size + " (kB)");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Hiba történt a kép betöltése során");
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/files/{tag:.+}")
    public ResponseEntity<?> getImagesByTag(@PathVariable String tag) {
        try {
            List<ResponseFileDTO> imageList = imageStorageService.loadByTag(tag).stream()
                    .filter(resource -> convertToResponseFileResource(resource) != null)
                    .map(resource -> convertToResponseFileResource(resource))
                    .collect(Collectors.toList());

            if (imageList.isEmpty() )
                return new ResponseEntity<>("Hibás keresési adat!",HttpStatus.NOT_FOUND);

            return ResponseEntity.status(HttpStatus.OK).body(imageList);
        } catch (IOException e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Hiba történt a képfájlok betöltáse során");
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filename/{filename}")
    public ResponseEntity<?> getImageByName(@PathVariable String filename) {
        try {
            List<ImageDTO> imageResources = imageStorageService.getImageReasourceByFilename(filename);


            /*List<ImageDTO> imageResources = imgs.stream()
                    .map(i -> convertToImageDTO(i)).collect(Collectors.toList());*/

            if (imageResources.isEmpty() )
                return new ResponseEntity<>("Hibás keresési adat!",HttpStatus.NOT_FOUND);

            return ResponseEntity.ok(imageResources);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Hibás keresési paraméter", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/class/{sclassName}")
    public ResponseEntity<?> getImageBySclass(@PathVariable String sclassName) {
        try {
            List<ImageDTO> imageResources;
            if (sclassName.trim().toLowerCase().equals("null") | sclassName == null){
                imageResources = imageStorageService.getImageResourcesIfNoClass();
            } else {
                Sclass sclass = classService.findByName(sclassName);
                imageResources = imageStorageService.getImageResourcesBySclass(sclass);
            }

            /*List<ImageDTO> imageResources = imgs.stream()
                    .map(i -> convertToImageDTO(i)).collect(Collectors.toList());*/
            return ResponseEntity.ok(imageResources);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Hibás keresési paraméter!", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ClassHead', 'Admin')")
    public ResponseEntity<?> saveImage(@RequestParam("file") MultipartFile file,
                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            String _username = userDetails.getUser().toString();
            User user = userService.findByName(_username).get(0);

            Optional<Sclass> sclass = Optional.ofNullable(user.getSclass());
            String signature = createSignature(_username, file.getOriginalFilename());

            imageStorageService.store(file, sclass, signature);

            ResponseFileDTO responseFileDTO = convertToResponseFileResource(file.getResource());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("A képfeltöltés sikertelen!");
        } catch (RuntimeException e1){
            return ResponseEntity.badRequest().body(e1.getMessage());
        } catch (Exception e2) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/synch")
    @PreAuthorize("hasAnyRole('ClassHead', 'Admin')")
    public ResponseEntity<?> synchronize(){
        try {
            String message = imageStorageService.synchronize();

            HashMap<String, Object> response = new HashMap<>();
            response.put("message", message);

            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("A szinkronizáció sikertelen!");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ClassHead', 'Admin')")
    public ResponseEntity<?> deleteImage(@PathVariable String id) {
        try {
            Image image = imageStorageService.find(id);

            imageStorageService.delete(image);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("A törlés sikertelen!");
        } catch (RuntimeException e1){
            return ResponseEntity.badRequest().body(e1.getMessage());
        } catch (Exception e2) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/all")
    @PreAuthorize("hasAnyRole('ClassHead', 'Admin')")
    public ResponseEntity<?> deleteImage() {
        try {
            imageStorageService.deleteAll();

            return ResponseEntity.ok("Minden kép eltávolítva!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("A törlés sikertelen!");
        } catch (RuntimeException e1){
            return ResponseEntity.badRequest().body(e1.getMessage());
        } catch (Exception e2) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    private ResponseFileDTO convertToResponseFileResource(Resource resource) {
        try {
            String fullName = resource.getFilename();

            if (fullName == null || fullName.isBlank()) {
                throw new RuntimeException("Érvénytelen fájlnév!");
            }

            String[] parts = getFileName(fullName);
            String name = parts[0];
            String extension = parts[1];

            if (imageStorageService.findIdByStoredName(parts[0], parts[1]).isPresent()) {
                String id = imageStorageService.findIdByStoredName(parts[0], parts[1])
                        .get();

                String filePath = "/api/images/file/" + fullName;
                long size = resource.contentLength();

                return new ResponseFileDTO(id, name, filePath, extension, size);

            } else return null;


        } catch (IOException e) {
            throw new RuntimeException("DTO konvertálási hiba!", e);
        }
    }

    private ImageDTO convertToImageDTO(Image image) {
        String id = image.getId();
        String name = image.getFilename();

        if (name == null || name.isBlank()) {
            throw new RuntimeException("Érvénytelen fájlnév!");
        }


        String signature = image.getSignature();
        String filePath = "/api/images/file/" + name;
        String extension = image.getExtension();
        String sclass = image.getSclass() == null ? "" : image.getSclass().getName();


        return new ImageDTO(id, name, signature, filePath, extension, sclass);
    }

    private String createSignature(String username, String filename) {
        String raw = username + "|" + filename + "|" + System.nanoTime();

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Signature generation failed", e);
        }
    }



}
