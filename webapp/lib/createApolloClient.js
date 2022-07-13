import { ApolloClient, InMemoryCache, ApolloLink, concat } from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";
const host = process.env.API || 'http://localhost:3003';
const URI = `${host}/graphql`;

function createApolloLink({authorization, locale}) {
    const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                authorization: authorization,
                "Accept-Language": locale
            }
        }));

        return forward(operation);
    });
    return concat(authMiddleware, createUploadLink({uri: URI}));
}

function createApolloClient(authorization = '', ssrMode = false, locale = 'en') {
    return new ApolloClient({
        // uri: "https://motogym-api-wr7nu.ondigitalocean.app/graphql",
        // uri: URI,
        link: createApolloLink({authorization, locale}),
        cache: new InMemoryCache(),
        ssrMode: ssrMode,
    });
}

export default createApolloClient;
