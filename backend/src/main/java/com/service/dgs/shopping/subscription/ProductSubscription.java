package com.service.dgs.shopping.subscription;

import org.springframework.stereotype.Component;
import com.netflix.graphql.dgs.DgsSubscription;
import com.service.dgs.shopping.model.Product;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.math.BigDecimal;

@Component
public class ProductSubscription {

	// 🔹 Multicast sink: every subscriber gets the same events
	private final Sinks.Many<Product> sink = Sinks.many().multicast().onBackpressureBuffer();

	/**
	 * Publish a product event to all subscribers.
	 * 
	 * @param product the newly created or updated product
	 */
	public void publish(Product product) {
		Sinks.EmitResult result = sink.tryEmitNext(product);
		if (result.isFailure()) {
			// log or handle failed emission
			System.err.println("Failed to emit product event: " + result);
		}
	}

	/**
	 * GraphQL subscription endpoint: all products
	 * 
	 * @return a Flux of Product
	 */
	@DgsSubscription
	public Flux<Product> productAdded() {
		return sink.asFlux();
	}

	/**
	 * GraphQL subscription endpoint: only products with price > 100
	 * 
	 * @return a Flux of expensive products
	 */
	@DgsSubscription
	public Flux<Product> expensiveProducts() {
		return sink.asFlux().filter(p -> p.getPrice() != null && p.getPrice().compareTo(BigDecimal.valueOf(100)) > 0);
	}

	/**
	 * Optional: complete the sink (no more events)
	 */
	public void complete() {
		sink.tryEmitComplete();
	}

	/**
	 * Optional: emit an error to all subscribers
	 */
	public void error(Throwable t) {
		sink.tryEmitError(t);
	}
}
