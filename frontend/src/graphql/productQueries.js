import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
      sku
      isAdult
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      sku
      isAdult
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      sku
      isAdult
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduct(id: $id)
  }
`;

//If you had an “Add Product” form, it would run a mutation like:
//That request goes to your Spring Boot backend, where your ProductDataFetcher handles it.
export const PRODUCT_ADDED = gql`
  subscription {
    productAdded {
      id
      name
      description
      price
      sku
      isAdult
    }
  }
`;
