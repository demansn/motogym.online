import {gql, useMutation} from "@apollo/client";

const REGISTRATION = gql`
    mutation registration($registrationInput: RegistrationInput!) {
        registration(registrationInput: $registrationInput)
    }
`;

const LOGIN = gql`
    mutation login($email: String! $password: String!) {
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

export function useAuthorizationMutation() {
    const [registrationMutation] = useMutation(REGISTRATION);
    const [loginMutation] = useMutation(LOGIN);
    const registration = (email, password, callback = () => {}) => {
        let error = null;
        let success = false

        return registrationMutation({variables: {registrationInput: {email, password}}}).then( ({data}) => {
            if (data) {
                if (data.registration === false) {
                    error = 'A user with such emails is already there, or the fields is entered incorrectly';
                } else if (data.registration === true) {
                    success = true;
                }
            }

            callback({error, success});

            return {error, success};
        });
    };
    const login = (email, password, callback = () => {}) => {
        return loginMutation({variables:{email, password}}).then( ({data}) => {
            let error = null;
            let success = false;

            if (data) {
                if (data.login.user && !data.login.user.isVerified) {
                    error = 'Email address is not verified! A new link has been sent to your mail to confirm the mail! Check your mail';
                } else if (data.login.user && data.login.token)  {
                    localStorage.setItem('token', data.login.token);

                    success = true;
                    // history.push(`driver/${data.login.user.id}`);
                } else {
                    error = 'Wrong email or password entered';
                }
            }

            callback({error, success});

            return {error, success};
        })
    };

    return {registration, login}
}
