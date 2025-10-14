// graphql/cartQueries.js
import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($userId: ID!) {
    getCart(userId: $userId) {
      userId
      items {
        id
        name
        price
        quantity
      }
      totalPrice
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($userId: ID!, $productId: ID!) {
    addToCart(userId: $userId, productId: $productId) {
      userId
      items { id name price quantity }
      totalPrice
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($userId: ID!, $productId: ID!, $quantity: Int!) {
    updateCartItem(userId: $userId, productId: $productId, quantity: $quantity) {
      userId
      items { id name price quantity }
      totalPrice
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($userId: ID!, $productId: ID!) {
    removeFromCart(userId: $userId, productId: $productId) {
      userId
      items { id name price quantity }
      totalPrice
    }
  }
`;
