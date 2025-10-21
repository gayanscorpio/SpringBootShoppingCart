package com.service.dgs.shopping.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.service.dgs.shopping.model.OrderItem;

@Repository
public interface OrderItemRepository extends ReactiveCrudRepository<OrderItem, Long> {

}
