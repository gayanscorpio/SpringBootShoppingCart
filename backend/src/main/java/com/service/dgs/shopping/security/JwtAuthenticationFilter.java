package com.service.dgs.shopping.security;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;

import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * This runs before every GraphQL request and injects authentication context.
 */
@Component
@AllArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {
	private static final Logger log = LogManager.getLogger(JwtAuthenticationFilter.class);

	private final JwtUtil jwtUtil;

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
		String header = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
		String gatewayToken = System.getenv("GATEWAY_INTROSPECTION_TOKEN"); // load from env

		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);

			// ✅ Allow Gateway token for introspection
			if (gatewayToken != null && token.equals(gatewayToken)) {
				log.debug("Received request with valid gateway token from {}",
						exchange.getRequest().getRemoteAddress());

				// Grant a special "GATEWAY" role
				var auth = new UsernamePasswordAuthenticationToken("GATEWAY", null,
						List.of(new SimpleGrantedAuthority("ROLE_GATEWAY")));

				return chain.filter(exchange).contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
			}

			// ✅ Normal JWT validation for real users
			try {
				var claims = jwtUtil.validateToken(token).getBody();
				String userId = claims.getSubject();
				String role = (String) claims.get("role");
				log.info("Authenticated user [{}] with role [{}] from {}", userId, role,
						exchange.getRequest().getRemoteAddress());

				var auth = new UsernamePasswordAuthenticationToken(userId, null,
						List.of(new SimpleGrantedAuthority("ROLE_" + role)));

				return chain.filter(exchange).contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));

			} catch (JwtException e) {
				log.warn("Invalid JWT token received from {}: {}", exchange.getRequest().getRemoteAddress(),
						e.getMessage());

				exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
				return exchange.getResponse().setComplete();
			} catch (Exception e) {
				log.error("Unexpected error while validating JWT: {}", e.getMessage(), e);
				exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
				return exchange.getResponse().setComplete();
			}
		}

		// No Authorization header → unauthenticated access
		log.debug("No Authorization header present for request {}", exchange.getRequest().getURI());
		return chain.filter(exchange);
	}
}
