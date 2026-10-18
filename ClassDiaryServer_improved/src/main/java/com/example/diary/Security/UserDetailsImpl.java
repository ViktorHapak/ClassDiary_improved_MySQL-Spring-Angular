package com.example.diary.Security;

import com.example.diary.dto.UserDTO;
import com.example.diary.models.Role;
import com.example.diary.models.Student;
import com.example.diary.models.TeacherRegistry;
import com.example.diary.models.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


public class UserDetailsImpl implements UserDetails {
  private static final Long serialVersionUID = 1L;

  private Integer id;

  private final User user;

  public UserDetailsImpl(User user){
    this.user = user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(new SimpleGrantedAuthority(user.getUserrole().toString())); // Felhasználói szerepek és jogosultságok
  }

  public Collection<? extends GrantedAuthority> getChildren() {
    return user.getChildren().stream().map(child -> new SimpleGrantedAuthority(child.getName())).collect(Collectors.toList());
    // Felhasználói szerepek és jogosultságok
  }

  public Collection<? extends GrantedAuthority> getSubjects() {
    return user.getTeacherRegistries().stream().map(reg -> new SimpleGrantedAuthority(reg.getSubject().getName())).distinct().collect(Collectors.toList());
    // Felhasználói szerepek és jogosultságok
  }

  public Collection<? extends GrantedAuthority> getSubjectRepositories() {
    return user.getTeacherRegistries().stream().map(reg -> new SimpleGrantedAuthority(reg.toString())).distinct().collect(Collectors.toList());
    // Felhasználói szerepek és jogosultságok
  }

  public Collection<? extends GrantedAuthority> getClasses() {
    try {
      return Collections.singletonList(new SimpleGrantedAuthority(user.getSclass().getName()));
    } catch (NullPointerException e) {
      return Collections.emptyList();
    }
  }

  @Override
  public String getPassword() {
    return this.user.getPassword();
  }

  @Override
  public String getUsername() {
    return this.user.getUsername();
  }

  public User getUser(){
      return this.user;
  };

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    UserDetailsImpl user = (UserDetailsImpl) o;
    return Objects.equals(id, user.id);
  }

}
