package com.example.diary.repositories;

import com.example.diary.dto.ImageDTO;
import com.example.diary.models.Image;
import com.example.diary.models.Sclass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {

    Optional<Image> findById(String id);

    List<Image> findByFilenameContains(String filename);

    Optional<Image> findByFilenameAndExtension(String filename, String extension);

    @Query("""
    select i.id
    from Image i
    where i.filename = :filename and i.extension = :extension
    """)
    Optional<String> findIdByFilenameAndExtension(
            @Param("filename") String filename,
            @Param("extension") String extension
    );

    List<Image> findBySclass(Sclass sclass);

    Optional<Image> findBySignature(String signature);

    @Query("""
        select new com.example.diary.dto.ImageDTO(
            i.id,
            i.filename,
            i.signature,
            concat('/api/images/file/', i.filename, i.extension),
            i.extension,
            coalesce(c.name, '')
        )
        from Image i
        left join i.sclass c
        where c = :sclass
    """)
    List<ImageDTO> findDtosBySclass(@Param("sclass") Sclass sclass);

    @Query("""
    select new com.example.diary.dto.ImageDTO(
        i.id,
        i.filename,
        i.signature,
        concat('/api/images/file/', i.filename, i.extension),
        i.extension,
        coalesce(c.name, '')
    )
    from Image i
    left join i.sclass c
    where i.filename like concat('%', :filename, '%')
    """)
    List<ImageDTO> findDtosByName(@Param("filename") String filename);

    @Query("""
    select new com.example.diary.dto.ImageDTO(
        i.id,
        i.filename,
        i.signature,
        concat('/api/images/file/', i.filename, i.extension),
        i.extension,
        'null'  
    )
    from Image i
    where i.sclass is null
    """)
    List<ImageDTO> findDtosIfNoClass();
}
