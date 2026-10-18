package com.example.diary.dto;

public class ImageDTO {
    private String id;
    private String name;
    private String signature;
    private String filePath;
    private String extension;
    private String sclass;

    public ImageDTO(String id, String name, String signature, String filePath, String extension, String sclass) {
        this.id = id;
        this.name = name;
        this.signature = signature;
        this.filePath = filePath;
        this.extension = extension;
        this.sclass = sclass;
    }

    public ImageDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getSclass() {
        return sclass;
    }

    public void setSclass(String sclass) {
        this.sclass = sclass;
    }

}
