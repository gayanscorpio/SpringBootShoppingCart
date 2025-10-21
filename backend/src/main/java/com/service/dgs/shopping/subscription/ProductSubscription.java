package com.service.dgs.shopping.subscription;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import com.netflix.graphql.dgs.DgsSubscription;
import com.service.dgs.shopping.model.Product;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.math.BigDecimal;

@Component
public class ProductSubscription {
	private static final Logger logger = LogManager.getLogger(ProductSubscription.class);

	// 🔹 Multicast sink: every subscriber gets the same events
	private final Sinks.Many<Product> sink = Sinks.many().multicast().onBackpressureBuffer();

	/**
	 * Publish a product event to all subscribers.
	 * 
	 * @param product the newly created or updated product
	 */
	public void publish(Product product) {
		logger.info("Publishing product event: ID={}, Name={}, Price={}", product.getId(), product.getName(),
				product.getPrice());
		Sinks.EmitResult result = sink.tryEmitNext(product);
		if (result.isFailure()) {
			logger.error("Failed to emit product event: {}", result);
		}
	}

	/**
	 * GraphQL subscription endpoint: all products
	 * 
	 * @return a Flux of Product
	 */
	@DgsSubscription
	public Flux<Product> productAdded() {
		logger.info("New subscription to productAdded");
		return sink.asFlux().doOnCancel(() -> logger.info("Subscription to productAdded cancelled"))
				.doOnNext(p -> logger.debug("Emitting productAdded: ID={}, Name={}", p.getId(), p.getName()));
	}

	/**
	 * GraphQL subscription endpoint: only products with price > 100
	 * 
	 * @return a Flux of expensive products
	 */
	@DgsSubscription
	public Flux<Product> expensiveProducts() {
		logger.info("New subscription to expensiveProducts");
		return sink.asFlux().filter(p -> {
			boolean isExpensive = p.getPrice() != null && p.getPrice().compareTo(BigDecimal.valueOf(100)) > 0;
			if (isExpensive) {
				logger.debug("Emitting expensive product: ID={}, Name={}, Price={}", p.getId(), p.getName(),
						p.getPrice());
			}
			return isExpensive;
		}).doOnCancel(() -> logger.info("Subscription to expensiveProducts cancelled"));
	}

	/**
	 * Optional: complete the sink (no more events)
	 */
	public void complete() {
		logger.info("Completing product subscription sink");
		sink.tryEmitComplete();
	}

	/**
	 * Optional: emit an error to all subscribers
	 */
	public void error(Throwable t) {
		logger.error("Emitting error to product subscription sink", t);
		sink.tryEmitError(t);
	}
}
