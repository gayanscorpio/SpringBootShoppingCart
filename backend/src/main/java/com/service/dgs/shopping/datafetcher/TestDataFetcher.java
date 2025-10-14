package com.service.dgs.shopping.datafetcher;

import com.netflix.graphql.dgs.*;
import java.util.*;

@DgsComponent
public class TestDataFetcher {

	@DgsQuery
	public String hello() {
		return "Hello from DGS 👋";
	}

	@DgsQuery
	public List<TestProduct> testProducts() {
		return List.of(new TestProduct(1L, "Laptop", 1200.50), new TestProduct(2L, "Phone", 650.75));
	}

	public record TestProduct(Long id, String name, Double price) {
	}
}
