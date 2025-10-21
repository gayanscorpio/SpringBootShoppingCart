package com.service.dgs.shopping.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

import java.math.BigDecimal;

/**
 * CartItem → temporary, belongs to a user’s cart before checkout.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("cart_items") // DB table
public class CartItem {

	@Id
	private Long id; // PK

	@Column("user_email")
	private String userEmail; // cart belongs to a user

	@Column("product_id")
	private Long productId; // product reference (can link to Product table)

	@Column("product_name")
	private String productName;

	private Integer quantity;

	private BigDecimal price; // price at the time of adding to cart
}
