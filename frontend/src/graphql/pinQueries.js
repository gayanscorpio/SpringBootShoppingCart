import { gql } from "@apollo/client";

export const SET_USER_PIN = gql`
  mutation SetUserPin($input: SetPinInput!) {
    setUserPin(input: $input) {
      success
      message
    }
  }
`;

export const VERIFY_USER_PIN = gql`
  mutation VerifyUserPin($input: VerifyPinInput!) {
    verifyUserPin(input: $input) {
      success
      message
    }
  }
`;

export const CHECK_USER_PIN = gql`
  query CheckUserPin($userId: String!) {
    checkUserPin(userId: $userId) {
      success
      message
    }
  }
`;

export const RESET_USER_PIN = gql`
  mutation ResetUserPin($username: String!, $password: String!, $newPin: String!) {
    resetUserPin(username: $username, password: $password, newPin: $newPin) {
      success
      message
    }
  }
`;


