package com.service.dgs.shopping.security;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * This runs before every GraphQL request and injects authentication context.
 */
@Component
public class JwtAuthenticationFilter implements WebFilter {

	private final JwtUtil jwtUtil;

	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
		String header = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			try {
				var claims = jwtUtil.validateToken(token).getBody();
				String userId = claims.getSubject();
				String role = (String) claims.get("role");

				var auth = new UsernamePasswordAuthenticationToken(userId, null,
						List.of(new SimpleGrantedAuthority("ROLE_" + role)));

				return chain.filter(exchange).contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));

			} catch (Exception e) {
				System.err.println("Invalid JWT: " + e.getMessage());
				return chain.filter(exchange);
			}
		}

		// no token → continue unauthenticated
		return chain.filter(exchange);
	}
}
