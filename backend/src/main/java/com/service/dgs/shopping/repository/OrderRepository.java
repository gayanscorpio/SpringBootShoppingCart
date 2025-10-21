package com.service.dgs.shopping.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.service.dgs.shopping.model.Order;

@Repository
public interface OrderRepository extends ReactiveCrudRepository<Order, Long> {

}
