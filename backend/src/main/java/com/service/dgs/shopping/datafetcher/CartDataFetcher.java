package com.service.dgs.shopping.datafetcher;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.service.dgs.shopping.dto.types.AddToCartInput;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.service.dgs.shopping.model.Cart;

@DgsComponent
public class CartDataFetcher {

    private final Map<String, Cart> carts = new ConcurrentHashMap<>();

    @DgsQuery
    public Cart cart(@InputArgument String userId) {
        return carts.getOrDefault(userId, new Cart(userId));
    }

    @DgsMutation
    public Cart addToCart(@InputArgument String userId, @InputArgument AddToCartInput input) {
        Cart cart = carts.computeIfAbsent(userId, Cart::new);
        cart.addItem(input.getProductId(), input.getQuantity());
        return cart;
    }

    @DgsMutation
    public Cart removeFromCart(@InputArgument String userId, @InputArgument String productId) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.removeItem(productId);
        }
        return cart;
    }
}

