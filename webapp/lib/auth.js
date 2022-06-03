import React, {useState, useContext, createContext} from 'react';
import {ApolloProvider, gql,} from '@apollo/client';
import createApolloClient from "./createApolloClient";
import {useTranslation} from "next-i18next";
import {setAuthTokenRequest} from "./setAuthTokenRequest";

const REGISTRATION = gql`
    mutation registration($registrationInput: RegistrationInput!) {
        registration(registrationInput: $registrationInput)
    }
`;

const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                email
                accessLevel
                isVerified
            }
        }
    }
`;

const SET_NEW_PASSWORD = gql`
    mutation newPassword($token: String! $password: String!) {
        resetPassword(token: $token, password: $password) {
            token
            user {
                id
                email
                accessLevel
                isVerified
            }
        }
    }
`;

const authContext = createContext();

export function AuthProvider({ children, authToken }) {
    const auth = useProvideAuth(authToken);
    const {i18n} = useTranslation();
    const ssrMode = typeof window === 'undefined';

    return (
        <authContext.Provider value={auth}>
            <ApolloProvider client={createApolloClient(authToken, ssrMode, i18n.language)}>
                {children}
            </ApolloProvider>
        </authContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth(defaultAuthToken) {
    const [authToken, setAuthToken] = useState(defaultAuthToken);

    const isSignedIn = () => {
        if (authToken) {
            return true;
        } else {
            return false;
        }
    };

    const getAuthHeaders = () => {
        if (!authToken) return null;

        return {
            authorization: `Bearer ${authToken}`
        };
    };

    const setToken = async (authToken) => {
        const result = setAuthTokenRequest(authToken);

        if (result) {
            setAuthToken(authToken);
        }

        return result;
    };

    const signIn = async (email, password) => {
        const client = createApolloClient();
        const {data} = await client.mutate({
            mutation: LOGIN,
            variables: { email, password },
        });
        let error = null;
        let success = false;
        let user = null;

        if (data) {
            if (data.login.user && !data.login.user.isVerified) {
                error = 'Email address is not verified! A new link has been sent to your mail to confirm the mail! Check your mail';
            } else if (data.login.user && data.login.token)  {

                success = setToken(data.login.token);
                user = data.login.user;
            } else {
                error = 'Wrong email or password entered';
            }
        }

        return {error, success, user};
    };

    const signUp = async (email, password) => {
        const client = createApolloClient();
        const result = await client.mutate({
            mutation: REGISTRATION,
            variables: {registrationInput: {email, password}},
        });
        let error = null;
        let success = false;

        if (result && result.data) {
            const {registration} = result.data;

            if (registration === false) {
                error = 'A user with such emails is already there, or the fields is entered incorrectly';
            } else if (registration === true) {
                success = true;
            }
        } else {
            error = 'Server error';
        }

        return {error, success};
    };

    const signOut = async () => {
        await fetch('/api/removeAuthToken');

        setAuthToken(null);
    };

    const resetPassword = async (resetToken, password) => {
        let status = 'error';
        const client = createApolloClient();
        const {data} = await client.mutate({
            mutation: SET_NEW_PASSWORD,
            variables: {token: resetToken, password}
        });

        if (data.resetPassword) {
            const {token, user} = data.resetPassword;

            if (user && token) {
                const success = await setToken(data.resetPassword.token);

                if (success) {
                    status = 'success';
                }
            } else if (user && !user.isVerified) {
                status = 'notVerified';
            }

            return {status, user};
        }

        return {status};
    };

    return {
        setAuthToken,
        isSignedIn,
        signIn,
        signOut,
        signUp,
        resetPassword
    };
}