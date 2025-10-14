package com.service.dgs.shopping.datafetcher;

import com.netflix.graphql.dgs.*;
import com.service.dgs.shopping.dto.types.CreateProductInput;
import com.service.dgs.shopping.dto.types.UpdateProductInput;
import com.service.dgs.shopping.model.Product;
import com.service.dgs.shopping.service.ProductService;
import com.service.dgs.shopping.subscription.ProductSubscription;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@DgsComponent
@AllArgsConstructor
public class ProductDataFetcher {

	private final ProductService service;
	private final ProductSubscription productSubscription;

	@DgsQuery
	public Flux<Product> products() {
		return service.findAll();
	}

	@DgsQuery
	public Mono<Product> productById(@InputArgument Long id) {
		return service.findById(id);
	}

	@DgsMutation
	public Mono<Product> createProduct(@InputArgument("input") CreateProductInput input) {
		Product p = new Product();
		p.setName(input.getName());
		p.setDescription(input.getDescription());
		p.setPrice(input.getPrice());
		p.setSku(input.getSku());

		return service.save(p).doOnSuccess(saved -> productSubscription.publish(saved)); // ✅ publish after save
	}

	@DgsMutation
	public Mono<Product> updateProduct(@InputArgument("id") Long id, @InputArgument("input") UpdateProductInput input) {
		return service.findById(id).flatMap(existing -> {
			if (input.getName() != null)
				existing.setName(input.getName());
			if (input.getDescription() != null)
				existing.setDescription(input.getDescription());
			if (input.getPrice() != null)
				existing.setPrice(input.getPrice());
			if (input.getSku() != null)
				existing.setSku(input.getSku());
			return service.save(existing).doOnSuccess(saved -> productSubscription.publish(saved));
		});
	}

	@DgsMutation
	public Mono<Boolean> deleteProduct(@InputArgument Long id) {
		return service.findById(id).flatMap(p -> service.deleteById(id).thenReturn(true)).defaultIfEmpty(false);
	}

	// -------------------- Subscriptions --------------------
	@DgsSubscription
	public Flux<Product> productAdded() {
		return productSubscription.productAdded();
	}

	@DgsSubscription
	public Flux<Product> expensiveProducts() {
		return productSubscription.expensiveProducts();
	}
}
