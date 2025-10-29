package com.service.dgs.shopping.security;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

/**
 * This helper verifies and parses JWTs using your RSA public key.
 */
@Component
public class JwtUtil {

	private final PublicKey publicKey;

	public JwtUtil() {
		try {
			String key = new String(Files.readAllBytes(Paths.get("src/main/resources/public.key")))
					.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "")
					.replaceAll("\\s+", "");
			byte[] decoded = Base64.getDecoder().decode(key);
			X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			this.publicKey = keyFactory.generatePublic(keySpec);
		} catch (Exception e) {
			throw new RuntimeException("Failed to load public key", e);
		}
	}

	public Jws<Claims> validateToken(String token) {
		return Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token);
	}

	public String extractRole(String token) {
		return (String) validateToken(token).getBody().get("role");
	}

	public String extractUserId(String token) {
		return validateToken(token).getBody().getSubject();
	}
}
