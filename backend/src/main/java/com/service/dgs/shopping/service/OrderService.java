package com.service.dgs.shopping.service;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.service.dgs.shopping.dto.types.OrderItemInput;
import com.service.dgs.shopping.model.Order;
import com.service.dgs.shopping.model.OrderItem;
import com.service.dgs.shopping.repository.OrderItemRepository;
import com.service.dgs.shopping.repository.OrderRepository;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class OrderService {
	private static final Logger log = LoggerFactory.getLogger(OrderService.class);

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

	/**
	 * Create empty Order object.
	 * 
	 * Save it in DB → DB generates order ID.
	 * 
	 * Convert GraphQL OrderItemInput → OrderItem entities with the generated order
	 * ID.
	 * 
	 * Save all items in DB.
	 * 
	 * Attach saved items to order.
	 * 
	 * Return the completed Order as a Mono<Order>.
	 * 
	 * @param userEmail   - userEmail → the email of the customer placing the order.
	 * @param totalAmount - the total cost of the order.
	 * @param items       - the list of products (coming from the GraphQL input
	 *                    OrderItemInput).
	 * @return - Returns a Mono<Order>, meaning it produces a single Order
	 *         asynchronously
	 */
	public Mono<Order> createOrder(String userEmail, Double totalAmount, List<OrderItemInput> items) {
		log.info("Starting createOrder for user: {}, totalAmount: {}", userEmail, totalAmount);

		Order order = Order.builder().userEmail(userEmail).totalAmount(BigDecimal.valueOf(totalAmount))
				.paymentStatus("PAID").build();

		log.debug("Created initial Order object (without ID): {}", order);

		// Saves the Order into the database using R2DBC ReactiveCrudRepository.
		// save(order) returns a Mono<Order> containing the savedOrder (now with a
		// generated ID).
		// flatMap(...) is used because after saving we want to run another reactive
		// operation (saving the items).
		return orderRepository.save(order).flatMap(savedOrder -> {

			log.info("Saved Order to DB with ID: {}", savedOrder.getId());

			// Converts each incoming OrderItemInput (i) into a database OrderItem entity.
			// null → ID left empty so DB will generate it. OrderItem(null,
			List<OrderItem> orderItems = items.stream().map(i -> new OrderItem(null,
					// savedOrder.getId() → links the item to its parent Order via foreign key.
					savedOrder.getId(), i.getProductName(), i.getQuantity(), BigDecimal.valueOf(i.getPrice())))
					.toList();

			log.debug("Converted GraphQL OrderItemInput to OrderItem entities: {}", orderItems);

			// Saves all OrderItem objects into the database reactively.
			// .collectList() gathers the Flux into a single Mono<List<OrderItem>>.
			return orderItemRepository.saveAll(orderItems).collectList().map(savedItems -> {
				// Adds the saved items into the Order object (so GraphQL returns the full order
				// with its items).
				savedOrder.setItems(savedItems);

				log.info("Saved {} OrderItems and attached to Order ID {}", savedItems.size(), savedOrder.getId());

				// Returns the completed Order.
				return savedOrder;
			});
		}).doOnError(e -> log.error("Failed to create order for user {}: {}", userEmail, e.getMessage(), e));
	}

}
