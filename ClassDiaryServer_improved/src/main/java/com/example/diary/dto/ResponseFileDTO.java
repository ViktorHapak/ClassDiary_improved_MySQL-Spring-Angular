package com.example.diary.dto;

public class ResponseFileDTO {
    private String id;
    private String name;
    private String filePath;
    private String extension;
    private long size;

    public ResponseFileDTO(String id, String name, String filePath, String extension, long size) {
        this.id = id;
        this.name = name;
        this.filePath = filePath;
        this.extension = extension;
        this.size = size;
    }

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


    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
