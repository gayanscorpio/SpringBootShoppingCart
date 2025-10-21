package com.service.dgs.shopping.model;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderItem → permanently stored after checkout (linked to an Order).
 */
@Table("order_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
	@Id
	private Long id;
	private Long orderId; // FK
	private String productName;
	private Integer quantity;
	private BigDecimal price;
}
