import createApolloClient from "./createApolloClient";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function getRedirectIfNotAccessLevel(context, accessLevel) {
    const {authToken = ''} = context.req.cookies;

    const redirect = {
        destination: '/',
        permanent: false,
    };

    if (accessLevel === 'user' && !authToken) {
        return redirect;
    } else if (accessLevel === 'guest' && authToken) {
        return redirect;
    } else {
        return null;
    }
}

async function defaultCallback() {
    return {props:{}};
}

async function createAppContext(context) {
    const {authToken = ''} = context.req.cookies;
    const apolloClient = createApolloClient(authToken, true, context.locale);
    const translations = await serverSideTranslations(context.locale);
    const appProps = {
        ...translations,
        authToken,
        host: context.req.headers.host
    };

    return {apolloClient, translations, appProps};
}

export function withAppContext(options = {}) {
    const {
        callback = defaultCallback,
        accessLevel = 'all' // all, user, guest
    } = options;

    return async (context) => {
        const redirect = getRedirectIfNotAccessLevel(context, accessLevel);

        if (redirect) {
            return {redirect};
        }

        const appContext = await createAppContext(context);
        const callbackResult = await callback({...context, ...appContext});

        if (callbackResult.props) {
            callbackResult.props = {...callbackResult.props, ...appContext.appProps};
        }

        return callbackResult;
    };
}

export default withAppContext;