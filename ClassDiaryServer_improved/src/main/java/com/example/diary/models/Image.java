package com.example.diary.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name="image", uniqueConstraints = {
        @UniqueConstraint(columnNames = "signature"),
        @UniqueConstraint(columnNames = {"filename","extension"})
    }
)
public class Image implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Column(name = "signature")
    private String signature;

    @NotBlank
    @Column(name = "filename")
    private String filename;

    @NotBlank
    @Column(name = "extension")
    private String extension;

    @JsonIgnore
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="class_id", nullable = true)
    private Sclass sclass;

    @Transient
    private String filePath;

    public Image(String signature, String filename, String extension, byte[] data) {
        this.signature = signature;
        this.filename = filename;
        this.extension = extension;
        this.data = data;
    }

    public Image(String filename, String extension, byte[] data) {
        this.filename = filename;
        this.extension = extension;
        this.data = data;
    }

    public Image() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        signature = signature;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Sclass getSclass() {
        return sclass;
    }

    public void setSclass(Sclass sclass) {
        this.sclass = sclass;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}