import createApolloClient from "./createApolloClient";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function getRedirectIfNotAccessLevel(context, accessLevel) {
    const {accessToken = ''} = context.req.cookies;

    const redirect = {
        destination: '/',
        permanent: false,
    };

    if (accessLevel === 'user' && !accessToken) {
        return redirect;
    } else if (accessLevel === 'guest' && accessToken) {
        return redirect;
    } else {
        return null;
    }
}

async function defaultCallback() {
    return {props:{}};
}

async function createAppContext(context) {
    const {accessToken = ''} = context.req.cookies;
    const apolloClient = createApolloClient(accessToken, false, context.locale);
    const translations = await serverSideTranslations(context.locale);
    const appProps = {
        ...translations,
        accessToken,
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
        try {
            const redirect = getRedirectIfNotAccessLevel(context, accessLevel);

            if (redirect) {
                return {redirect};
            }

            const appContext = await createAppContext(context);
            const callbackResult = await callback({...context, ...appContext});

            if (callbackResult.props) {
                callbackResult.props = {...appContext.appProps, ...callbackResult.props};
            }

            return callbackResult;
        } catch (e) {
            console.error(e);

            return {redirect: {destination: '/500'}};
        }
    };
}

export default withAppContext;
