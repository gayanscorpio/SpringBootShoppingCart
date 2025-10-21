package com.service.dgs.shopping.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.service.dgs.shopping.dto.types.CartItem;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
	private String userId;
	private List<CartItem> items = new ArrayList<>();
	private String id;

	public Cart(String userId) {
		this.id = UUID.randomUUID().toString(); // assign non-null ID
		this.userId = userId;
	}

	public void addItem(String productId, int qty) {
		Optional<CartItem> existing = items.stream().filter(i -> i.getProduct().getId().equals(productId)).findFirst();

		if (existing.isPresent()) {
			existing.get().setQuantity(existing.get().getQuantity() + qty);
		} else {
			// Step 1: convert String → Long for entity
			Long prodId = Long.parseLong(productId);
			Product productEntity = new Product(prodId, "Dummy", "", BigDecimal.ZERO, "SKU");

			// Step 2: convert entity → DTO
			com.service.dgs.shopping.dto.types.Product gqlProduct = com.service.dgs.shopping.dto.types.Product
					.newBuilder().id(productId).name(productEntity.getName())
					.description(productEntity.getDescription()).price(productEntity.getPrice())
					.sku(productEntity.getSku()).build();

			// Step 3: add CartItem
			items.add(new CartItem(UUID.randomUUID().toString(), gqlProduct, qty));
		}
	}

	public void removeItem(String productId) {
		items.removeIf(i -> i.getProduct().getId().equals(productId));
	}
}
