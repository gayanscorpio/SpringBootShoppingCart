package com.service.dgs.shopping.config;

import com.service.dgs.shopping.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	@Bean
	public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, CorsWebFilter corsWebFilter) {
		return http.csrf(csrf -> csrf.disable())
				.authorizeExchange(
						exchanges -> exchanges.pathMatchers("/graphql").authenticated().anyExchange().permitAll())
				.addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
				// apply CORS filter explicitly
				.addFilterAt(corsWebFilter, SecurityWebFiltersOrder.CORS).build();
	}
}
