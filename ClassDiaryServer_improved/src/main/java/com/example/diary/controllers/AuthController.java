package com.example.diary.controllers;


import com.example.diary.Security.UserDetailsImpl;
import com.example.diary.Security.jwt.JwtUnit;
import com.example.diary.Security.jwt.TokenBlacklist;
import com.example.diary.dto.AuthenticationDTO;
import com.example.diary.dto.RegisterDTO;
import com.example.diary.dto.UserDTO;
import com.example.diary.models.Role;
import com.example.diary.models.Student;
import com.example.diary.models.TeacherRegistry;
import com.example.diary.models.User;
import com.example.diary.repositories.UserRepository;
import com.example.diary.util.UserValidator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUnit jwtUnit;

  @Autowired
  private TokenBlacklist tokenBlacklist;

  @Autowired
  UserValidator userValidator;

  @Autowired
  ModelMapper modelMapper;

  private UserDTO userResource;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody @Valid  AuthenticationDTO authDTO,
                                            BindingResult bindingResult) {
      try {
          Authentication authentication = authenticationManager.authenticate(
                  new UsernamePasswordAuthenticationToken(authDTO.getUsername(), authDTO.getPassword()));
          SecurityContextHolder.getContext().setAuthentication(authentication);

          authentication = SecurityContextHolder.getContext().getAuthentication();
          //Avoid generating token, if there is an existant token for the username - remove from blackList!
          //----------------------//

          //Generate new token in the case of absence of valid token
          String jwt = jwtUnit.generateJwtToken(authentication);

          UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
          Collection<? extends GrantedAuthority> role = userDetails.getAuthorities();

          Map<String, Object> response = new HashMap<>();
          response.put("token", jwt);

          return ResponseEntity.ok(response);
      }
      catch (BadCredentialsException e1){
          return ResponseEntity.badRequest().body("Helytelen jelszó!");
      }
      catch (RuntimeException e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
      catch (Exception e){
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @GetMapping("/user")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> getUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
          try{
              String _username = userDetails.getUser().toString();
              Collection<? extends GrantedAuthority> role = userDetails.getAuthorities();

              User user = userRepository.findByUsername(_username).orElse(null);

              System.out.println("Authenticated user: " + user.toString());
              Map<String, Object> response = new HashMap<>();
              response.put("username", user.toString());
              response.put("role", userDetails.getAuthorities().stream()
                      .map(item -> item.getAuthority()));


              if (role.toString().contains(Role.ROLE_Parent.toString()))
                  response.put("children",
                                user.getChildren().stream().map(s -> s.getName()).toList());

              if (role.toString().contains(Role.ROLE_Teacher.toString())
                  || role.toString().contains(Role.ROLE_ClassHead.toString()))
                  response.put("subjects",
                               user.getTeacherRegistries().stream().map(s -> s.getSubject().getName()).distinct().toList());

              if (role.toString().contains(Role.ROLE_Teacher.toString())
                      || role.toString().contains(Role.ROLE_ClassHead.toString()))
                  response.put("learning",
                               user.getTeacherRegistries().stream().map(l -> l.toString()).toList());

              if (role.toString().contains(Role.ROLE_ClassHead.toString()))
                  response.put("class", user.getSclass().getName());


              return new ResponseEntity<>(response, HttpStatus.OK);
          } catch (NullPointerException e) {
              return ResponseEntity.badRequest().body("A felhasználó keresése sikertelen");
          } catch (Exception e){
              return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
          }

  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterDTO registerDTO, BindingResult bindingResult) {

   User user = convertToUser(registerDTO);

   user.setPassword(encoder.encode(registerDTO.getPassword()));
   user.setUserrole(Role.ROLE_Visitor);
   user.setCreatedAt(LocalDateTime.now());

   userValidator.validate(user, bindingResult);
   if(bindingResult.hasErrors()) return ResponseEntity.badRequest()
           .body("Regisztrációs hiba: " + bindingResult.getFieldErrors().stream()
                   .map(e -> e.getDefaultMessage()).collect(Collectors.joining(", ")));

   userRepository.save(user);

   Map<String, String> response = new HashMap<>();
   response.put("message", "Új felhasználó: " + user.getUsername());
   return ResponseEntity.ok(response);
  }

  @PostMapping("/signout")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> signoutUser(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                       HttpServletRequest request) {
      try{
          String header = request.getHeader("Authorization");
          if (header != null && header.startsWith("Bearer ")) {
              String jwt = header.substring(7);
              if (jwtUnit.validateJwtToken(jwt)) {
                  String jti = jwtUnit.getJti(jwt);
                  Date exp = jwtUnit.getExpiration(jwt);
                  tokenBlacklist.revoke(jti, exp);
              } else return ResponseEntity.badRequest().body("Nincs bejelentkezve!");
              SecurityContextHolder.clearContext();
              return ResponseEntity.ok("Kijelentkezve: " + userDetails.getUsername());
          }
          return ResponseEntity.badRequest().body("Nincs bejelentkezve!");
      } catch (Exception e) {
          return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }

  }


  private User convertToUser(RegisterDTO personDTO) {
    return this.modelMapper.map(personDTO, User.class);
  }

  private UserDTO convertToUserResource(User user) {
    UserDTO dto = modelMapper.map(user, UserDTO.class);
      dto.setRole(user.getUserrole().toString());

      // Parent: children
      if (user.getUserrole() == Role.ROLE_Parent) {
          dto.setChildren(
                  user.getChildren().stream()
                          .map(Student::getName)   // or getId().toString()
                          .toList()
          );
      } else {
          dto.setChildren(List.of()); // or null
      }

      // Teacher / ClassHead: subjects (from registries)
      if (user.getUserrole() == Role.ROLE_Teacher || user.getUserrole() == Role.ROLE_ClassHead) {
          dto.setSubjects(
                  user.getTeacherRegistries().stream()
                          .map(reg -> reg.getSubject().getName())
                          .distinct()
                          .toList()
          );

          dto.setLearning(
                  user.getTeacherRegistries().stream()
                          .map(TeacherRegistry::toString)
                          .distinct()
                          .toList()
          );
      } else {
          dto.setSubjects(List.of());
      }

      // ClassHead: class
      if (user.getUserrole() == Role.ROLE_ClassHead && user.getSclass() != null) {
          dto.setSclass(user.getSclass().getName());
      }

      return dto;
  }

}
