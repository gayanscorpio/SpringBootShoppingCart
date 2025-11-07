package com.service.dgs.shopping.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Table("products") // ✅ R2DBC uses @Table, not @Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Product {

	@Id // ✅ R2DBC Id annotation (no GenerationType.IDENTITY)
	private Long id;

	@Column("name") // ✅ optional, maps column explicitly
	private String name;

	@Column("description")
	private String description;

	@Column("price")
	private BigDecimal price;

	@Column("sku")
	private String sku;

	/**
	 * This is a reference type (an object).
	 */
	@Column("is_adult")
	private Boolean isAdult; // Wrapper type - Boolean : this can be Null also than "true", "false"
}
