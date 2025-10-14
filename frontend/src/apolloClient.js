//🔹 2. Apollo Client (connect to Spring Boot DGS)
import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// HTTP link for queries/mutations
const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql"
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
    url: "ws://localhost:8080/subscriptions"
}));

// Split based on operation type
const splitLink = split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink
);

// HTTP link for queries/mutations
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;