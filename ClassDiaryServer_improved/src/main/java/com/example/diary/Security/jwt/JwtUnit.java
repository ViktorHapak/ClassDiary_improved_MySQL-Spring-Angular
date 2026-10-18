package com.example.diary.Security.jwt;

import com.example.diary.Security.UserDetailsImpl;
import com.example.diary.Security.UserDetailsServiceImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUnit {
  private static final Logger logger = LoggerFactory.getLogger(JwtUnit.class);

  @Value("${jwtSecret}")
  private String jwtSecret;

  @Autowired
  TokenBlacklist tokenBlacklist;



  public String generateJwtToken(Authentication authentication) {

    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
    String jti = UUID.randomUUID().toString();

    return Jwts.builder()
        .setSubject((userPrincipal.getUsername()))
        .setId(jti)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }

  private Key key() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String getJti(String token) {
    return getClaims(token).getId();
  }

  public Date getExpiration(String token) {
    return getClaims(token).getExpiration();
  }

  public String getUserNameFromJwtToken(String token) {
    return getClaims(token).getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Claims claims = getClaims(authToken);

      String jti = claims.getId();
      if (tokenBlacklist.isRevoked(jti)) {
        logger.warn("JWT revoked (jti={})", jti);
        return false;
      }

      Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }

  private Claims getClaims(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(key())
            .build()
            .parseClaimsJws(token)
            .getBody();
  }
}
