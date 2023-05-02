
export class Auth {
    constructor(serviceLocator) {
    }
    login({email, password}) {
        const token = null;
        const refreshToken = null;

        const users = serviceLocator.getDB().get('users')
        const user = users.findOne({email});

        if (!user || user.password !== password) {
            return null;
        }

        return {
            token,
            refreshToken
        }
    }
}
