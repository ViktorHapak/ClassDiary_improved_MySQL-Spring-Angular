package com.example.diary.dto;

import com.example.diary.models.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class UserDTO {

    @NotBlank
    private String username;

    @NotBlank
    private String email;

    @NotNull
    private LocalDate birth;

    @NotBlank
    private String password;

    @NotBlank
    private String role;

    private List<String> children;   // children names or ids
    private List<String> subjects;   // subject names
    private String sclass;           // class name (ok as String)

    private List<String> learning;


    public UserDTO(String username, List<String> learning, String sclass,
                   List<String> subjects, String role, List<String> children,
                   String password, LocalDate birth, String email) {
        this.username = username;
        this.learning = learning;
        this.sclass = sclass;
        this.subjects = subjects;
        this.role = role;
        this.children = children;
        this.password = password;
        this.birth = birth;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirth() {
        return birth;
    }

    public void setBirth(LocalDate birth) {
        this.birth = birth;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getChildren() {
        return children;
    }

    public void setChildren(List<String> children) {
        this.children = children;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public String getSclass() {
        return sclass;
    }

    public void setSclass(String sclass) {
        this.sclass = sclass;
    }

    public List<String> getLearning() {
        return learning;
    }

    public void setLearning(List<String> learning) {
        this.learning = learning;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", birth=" + birth +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", children=" + children +
                ", subjects=" + subjects +
                ", sclass='" + sclass + '\'' +
                ", learning=" + learning +
                '}';
    }
}
