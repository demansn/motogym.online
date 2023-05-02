import { ApolloClient, InMemoryCache, ApolloLink, concat } from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";
const host = process.env.NEXT_PUBLIC_API_URL;
const URI = `${host}/graphql`;

function createApolloLink({accessToken, locale}) {
    const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : '',
                "Accept-Language": locale
            }
        }));

        return forward(operation);
    });
    return concat(authMiddleware, createUploadLink({uri: URI}));
}

function createApolloClient(accessToken = '', ssrMode = false, locale = 'en') {
    return new ApolloClient({
        uri: URI,
        link: createApolloLink({accessToken, locale}),
        cache: new InMemoryCache(),
        ssrMode: ssrMode,
    });
}

export default createApolloClient;
