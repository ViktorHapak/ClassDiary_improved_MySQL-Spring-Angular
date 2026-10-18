package com.example.diary.Security;

import com.example.diary.Security.jwt.JwtUnit;
import com.example.diary.Security.jwt.RequestFilter;
import com.example.diary.Security.jwt.TokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {

  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  JwtUnit jwtUnit; // Injektáljuk ide a JwtUnitot

  @Autowired
  RequestFilter requestFilter; // Ez maradhat Component és autowired

  @Autowired
  TokenFilter tokenFilter;

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       
      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoder());
   
      return authProvider;
  }

  
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
          throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }


  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .exceptionHandling(exception -> exception.authenticationEntryPoint(requestFilter))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth ->
          auth.requestMatchers("/api/auth/signin", "/api/auth/signup").permitAll()
                  .requestMatchers("/api/data/students/**").permitAll()
                  .requestMatchers("/api/data/users/**").permitAll()
                  .requestMatchers("/api/data/subjects/**").permitAll()
                  .requestMatchers("/api/grades/**").permitAll()
                  .requestMatchers("/api/images/**").permitAll()
                  .requestMatchers("/api/auth/user", "/api/auth/signout").authenticated()
              .anyRequest().authenticated()
        );
    
    http.authenticationProvider(authenticationProvider());

    // ITT példányosítjuk a filtert manuálisan:
    TokenFilter tokenFilter = new TokenFilter(jwtUnit, userDetailsService);
    http.addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type"));
    config.setExposedHeaders(List.of("Authorization"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  @Bean
  public FilterRegistrationBean<TokenFilter> tokenFilterRegistration(TokenFilter filter) {
    FilterRegistrationBean<TokenFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false); // Automatikus regisztráció kikapcsolása
    return registration;
  }


}
