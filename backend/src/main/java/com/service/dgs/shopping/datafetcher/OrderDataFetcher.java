package com.service.dgs.shopping.datafetcher;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import com.service.dgs.shopping.model.Order;
import com.service.dgs.shopping.service.OrderService;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Mono;
import com.service.dgs.shopping.dto.types.OrderItemInput;

@DgsComponent
@AllArgsConstructor
public class OrderDataFetcher {
	private static final Logger log = LoggerFactory.getLogger(OrderDataFetcher.class);

	private final OrderService orderService;

	@DgsMutation
	public Mono<Order> createOrder(@InputArgument String userEmail, @InputArgument Double totalAmount,
			@InputArgument List<OrderItemInput> items) {
		log.info("Creating order for userEmail={}, totalAmount={}, items={}", userEmail, totalAmount, items);

		return orderService.createOrder(userEmail, totalAmount, items)
				.doOnSuccess(order -> log.info("Order created successfully: orderId={}", order.getId()))
				.doOnError(error -> log.error("Failed to create order for userEmail={}", userEmail, error));
	}
}
