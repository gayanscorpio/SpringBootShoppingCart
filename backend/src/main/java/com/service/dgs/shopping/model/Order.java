package com.service.dgs.shopping.model;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("orders")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {

	@Id
	private Long id;

	@Column("user_email")
	private String userEmail;

	@Column("total_amount")
	private BigDecimal totalAmount;

	@Column("payment_status")
	private String paymentStatus;

	@Transient
	private List<OrderItem> items;
}
