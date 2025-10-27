import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";

// HTTP link (queries/mutations)
const httpLink = new HttpLink({ uri: "http://localhost:8080/graphql" });

// Auth link
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    }));
    return forward(operation);
});

// Error link
const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError && (networkError.statusCode === 401 || networkError.statusCode === 403)) {
        console.warn("🔒 Token expired or unauthorized. Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.warn(`[GraphQL error]: Message: ${message}, Path: ${path}`)
        );
    }
});

// WebSocket link (subscriptions)
const wsLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:8080/subscriptions",
        connectionParams: () => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
        },
    })
);

// Split link: WS for subscriptions, HTTP for queries/mutations
const splitLink = split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    ApolloLink.from([errorLink, authLink, httpLink])
);

// Apollo Client
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;
