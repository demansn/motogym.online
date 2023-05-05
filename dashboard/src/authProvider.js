import {isJwtTokenExpired} from "../../common/jwtUtils";
import {AUTH_API} from "./configs";

const authProvider = {
    // called when the user attempts to log in
    login: ({ username, password }) =>  {
        const request = new Request(`${AUTH_API}/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => response.json().then(body => ({body, response})))
            .then(({body, response }) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(body.error);
                }

                localStorage.setItem('accessToken', body.accessToken);
            })
            .catch((e) => {
                throw new Error(e);
            });
    },
    logout: () => {
        localStorage.removeItem('accessToken');

        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('accessToken');
            return Promise.reject();
        }

        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        const accessToken = localStorage.getItem('accessToken');
        const isAuthenticated = accessToken && !isJwtTokenExpired(accessToken);

        return isAuthenticated ? Promise.resolve() : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};

export default authProvider;
