package com.service.dgs.shopping.datafetcher;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.service.dgs.shopping.dto.types.AddToCartInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.service.dgs.shopping.model.Cart;

@DgsComponent
public class CartDataFetcher {
	private static final Logger log = LoggerFactory.getLogger(CartDataFetcher.class);

	private final Map<String, Cart> carts = new ConcurrentHashMap<>();

	@DgsQuery
	public Cart cart(@InputArgument String userId) {
		log.info("Fetching cart for userId={}", userId);
		Cart cart = carts.getOrDefault(userId, new Cart(userId));
		log.debug("Cart contents: {}", cart.getItems());
		return cart;
	}

	@DgsMutation
	public Cart addToCart(@InputArgument String userId, @InputArgument AddToCartInput input) {
		log.info("Adding to cart: userId={}, productId={}, quantity={}", userId, input.getProductId(),
				input.getQuantity());
		Cart cart = carts.computeIfAbsent(userId, Cart::new);
		cart.addItem(input.getProductId(), input.getQuantity());
		log.debug("Updated cart items: {}", cart.getItems());
		return cart;
	}

	@DgsMutation
	public Cart removeFromCart(@InputArgument String userId, @InputArgument String productId) {
		log.info("Removing from cart: userId={}, productId={}", userId, productId);
		Cart cart = carts.get(userId);
		if (cart != null) {
			cart.removeItem(productId);
			log.debug("Updated cart items after removal: {}", cart.getItems());
		} else {
			log.warn("Attempted to remove item from non-existent cart for userId={}", userId);
		}
		return cart;
	}
}
