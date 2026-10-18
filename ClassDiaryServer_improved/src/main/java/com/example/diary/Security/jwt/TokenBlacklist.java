package com.example.diary.Security.jwt;

import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final ConcurrentHashMap<String, Long> revoked = new ConcurrentHashMap<>();

    public void revoke(String jti, Date exp) {
        revoked.put(jti, exp.getTime());
    }

    public boolean isRevoked(String jti) {
        Long expMs = revoked.get(jti);
        if (expMs == null) return false;
        if (expMs < System.currentTimeMillis()) { // cleanup
            revoked.remove(jti);
            return false;
        }
        return true;
    }
}