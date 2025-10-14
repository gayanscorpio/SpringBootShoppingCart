package com.service.dgs.shopping.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import com.service.dgs.shopping.model.Product;
import com.service.dgs.shopping.repository.ProductRepository;

@Service
public class ProductService {

	private final ProductRepository repo;

	public ProductService(ProductRepository repo) {
		this.repo = repo;
	}

	// Return all products as a reactive stream
	public Flux<Product> findAll() {
		return repo.findAll();
	}

	// Return a single product by id
	public Mono<Product> findById(Long id) {
		return repo.findById(id);
	}

	// Save a product (insert or update)
	public Mono<Product> save(Product p) {
		return repo.save(p);
	}

	// Delete product by id
	public Mono<Void> deleteById(Long id) {
		return repo.deleteById(id);
	}
}
