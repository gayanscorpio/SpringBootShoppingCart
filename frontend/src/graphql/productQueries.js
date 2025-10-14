import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
      sku
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
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const PRODUCT_ADDED = gql`
  subscription {
    productAdded {
      id
      name
      description
      price
      sku
    }
  }
`;
