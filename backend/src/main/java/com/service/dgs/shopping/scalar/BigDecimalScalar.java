package com.service.dgs.shopping.scalar;

import com.netflix.graphql.dgs.DgsScalar;
import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;

import java.math.BigDecimal;

@DgsScalar(name = "BigDecimal")
public class BigDecimalScalar implements Coercing<BigDecimal, String> {

	@Override
	public String serialize(Object dataFetcherResult) throws CoercingSerializeException {
		if (dataFetcherResult instanceof BigDecimal) {
			return ((BigDecimal) dataFetcherResult).toPlainString();
		}
		throw new CoercingSerializeException("Expected a BigDecimal object.");
	}

	@Override
	public BigDecimal parseValue(Object input) throws CoercingParseValueException {
		try {
			return new BigDecimal(input.toString());
		} catch (NumberFormatException e) {
			throw new CoercingParseValueException("Invalid BigDecimal value: " + input);
		}
	}

	@Override
	public BigDecimal parseLiteral(Object input) throws CoercingParseLiteralException {
		if (input instanceof StringValue) {
			try {
				return new BigDecimal(((StringValue) input).getValue());
			} catch (NumberFormatException e) {
				throw new CoercingParseLiteralException("Invalid BigDecimal literal: " + input);
			}
		}
		throw new CoercingParseLiteralException("Expected AST type 'StringValue'.");
	}
}
