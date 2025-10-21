package com.service.dgs.shopping.datafetcher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
	private static final Logger log = LoggerFactory.getLogger(ProductDataFetcher.class);

	private final ProductService service;
	private final ProductSubscription productSubscription;

	@DgsQuery
	public Flux<Product> products() {
		log.info("Fetching all products");
		return service.findAll().doOnNext(p -> log.debug("Found product: id={}, name={}", p.getId(), p.getName()));
	}

	@DgsQuery
	public Mono<Product> productById(@InputArgument Long id) {
		log.info("Fetching product by ID={}", id);
		return service.findById(id).doOnSuccess(p -> {
			if (p != null) {
				log.info("Found product: id={}, name={}", p.getId(), p.getName());
			} else {
				log.warn("Product with ID={} not found", id);
			}
		});
	}

	@DgsMutation
	public Mono<Product> createProduct(@InputArgument("input") CreateProductInput input) {
		log.info("Creating product: name={}, sku={}, price={}", input.getName(), input.getSku(), input.getPrice());
		Product p = new Product();
		p.setName(input.getName());
		p.setDescription(input.getDescription());
		p.setPrice(input.getPrice());
		p.setSku(input.getSku());

		return service.save(p).doOnSuccess(saved -> {
			log.info("Product created: id={}, name={}", saved.getId(), saved.getName());
			productSubscription.publish(saved);
		});
	}

	@DgsMutation
	public Mono<Product> updateProduct(@InputArgument("id") Long id, @InputArgument("input") UpdateProductInput input) {
		log.info("Updating product id={}", id);

		return service.findById(id).flatMap(existing -> {
			if (input.getName() != null)
				existing.setName(input.getName());
			if (input.getDescription() != null)
				existing.setDescription(input.getDescription());
			if (input.getPrice() != null)
				existing.setPrice(input.getPrice());
			if (input.getSku() != null)
				existing.setSku(input.getSku());

			return service.save(existing).doOnSuccess(saved -> {
				log.info("✅ Product updated: id={}, name={}", saved.getId(), saved.getName());
				productSubscription.publish(saved);
			});
		}).switchIfEmpty(Mono.fromRunnable(() -> log.warn("⚠️ Product with id={} not found for update", id)));
	}

	@DgsMutation
	public Mono<Boolean> deleteProduct(@InputArgument Long id) {
		log.info("Deleting product id={}", id);
		return service.findById(id).flatMap(
				p -> service.deleteById(id).doOnSuccess(v -> log.info("Deleted product id={}", id)).thenReturn(true))
				.defaultIfEmpty(false).doOnNext(result -> {
					if (!result)
						log.warn("Product with id={} not found for deletion", id);
				});
	}

	// -------------------- Subscriptions --------------------
	@DgsSubscription
	public Flux<Product> productAdded() {
		log.info("Subscribed to productAdded events");
		return productSubscription.productAdded();
	}

	@DgsSubscription
	public Flux<Product> expensiveProducts() {
		log.info("Subscribed to expensiveProducts events");
		return productSubscription.expensiveProducts();
	}
}
