package com.service.dgs.shopping.datafetcher;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.service.dgs.shopping.dto.types.PaymentIntentResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@DgsComponent
public class PaymentDataFetcher {
	private static final Logger log = LoggerFactory.getLogger(PaymentDataFetcher.class);

	@DgsMutation
	public PaymentIntentResponse createPaymentIntent(@InputArgument Integer amount) {
		log.info("Creating PaymentIntent for amount={}", amount);

		// ✅ Load secret from environment variables in production
		Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

		try {
			PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(Long.valueOf(amount))
					.setCurrency("usd").build();

			PaymentIntent intent = PaymentIntent.create(params);

			log.info("PaymentIntent created successfully: id={}, amount={}", intent.getId(), intent.getAmount());

			return new PaymentIntentResponse(intent.getClientSecret());
		} catch (StripeException e) {
			log.error("Failed to create PaymentIntent for amount={}", amount, e);
			throw new RuntimeException("PaymentIntent creation failed", e);
		}
	}
}
