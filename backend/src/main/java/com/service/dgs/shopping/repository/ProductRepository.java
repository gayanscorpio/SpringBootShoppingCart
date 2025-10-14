package com.service.dgs.shopping.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.service.dgs.shopping.model.Product;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {

	// Example custom queries (reactive)
	Flux<Product> findByNameContainingIgnoreCase(String name);

	Mono<Product> findBySku(String sku);
}
