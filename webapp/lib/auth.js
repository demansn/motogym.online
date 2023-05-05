import React, {useState, useContext, createContext} from 'react';
import {ApolloProvider, gql,} from '@apollo/client';
import createApolloClient from "./createApolloClient";
import {useTranslation} from "next-i18next";
import {host} from "../config";
import {getJwtTokenPayload} from "../../common/jwtUtils";
import {authRequest} from "./utils";
import {useLanguage} from "../hooks/useLanguage";

const authContext = createContext();

export function AuthProvider({ children, accessToken}) {
    const auth = useProvideAuth(accessToken);
    const {i18n} = useTranslation();
    const ssrMode = true;

    return (
        <authContext.Provider value={auth}>
            <ApolloProvider client={createApolloClient(accessToken, ssrMode, i18n.language)}>
                {children}
            </ApolloProvider>
        </authContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth(defaultAccessToken) {
    const [accessToken, setAccessToken] = useState(defaultAccessToken);
    const [currentLanguage] = useLanguage();

    const isSignedIn = () => {
        return !!accessToken;
    };

    const getAuthorizedUser = () => {
        if (accessToken) {
            return null;
        }

        const {emil, id, accessToken, isVerified} = getJwtTokenPayload(accessToken);

        return {emil, id, accessToken, isVerified};
    };

    const signIn = async (email, password) => {
        const response = await fetch(`${host}/api/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8', 'accept-language': currentLanguage},
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        let errorMessage = null;
        let success = false;
        let accessToken = data.accessToken;

        if (data.error) {
            if (data.error.status === 'invalidEmailOrPassword') {
                errorMessage = 'Wrong email or password entered';

            } else if (data.error.status === 'emailNotVerified')  {
                errorMessage = 'Email address is not verified! A new link has been sent to your mail to confirm the mail! Check your mail';
            } else {
                errorMessage = 'Wrong email or password entered';
            }
        } else {
            setAccessToken(accessToken);
            success = true;
        }

        return {error: errorMessage, success, accessToken};
    };

    const signUp = async ({email, password, verificationLink}) => {
        const data = await authRequest('signup', {email, password, verificationLink}, currentLanguage);
        let error = null;
        let success = false;

        if (data.error) {
            if (data.status === 'emailAlreadyExists') {
                error = 'A user with such emails is already there, or the fields is entered incorrectly';
            } else {
                error = data.error;
            }
        } else if (data.status === 'ok'){
            success = true;
        } else {
            error = 'Server error';
        }

        return {error, success};
    };

    const signOut = async () => {
        await fetch(`${host}/api/logout`, {method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8', 'Accept-Language': currentLanguage}});

        setAccessToken(null);
    };

    const forgotPassword = async ({email, resetPasswordLink}) => {
        const data = await authRequest('forgot-password', {email, resetPasswordLink}, currentLanguage);
        const status = data.status === 'ok' ? 'success' : 'error';

        return {status};
    };

    const resetPassword = async (token, password) => {
        const data = await authRequest('set-new-password', {token, password}, currentLanguage);
        const status = data.status === 'ok' ? 'success' : 'error';

        return {status};
    };

    return {
        setAuthToken: setAccessToken,
        isSignedIn,
        signIn,
        signOut,
        signUp,
        forgotPassword,
        resetPassword,
        getAuthorizedUser
    };
}
