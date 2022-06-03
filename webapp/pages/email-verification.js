import {CenteredContainer, T} from "@components";
import {Container} from "react-bootstrap";
import withAppContext from "lib/withAppContext";

import {gql} from "@apollo/client";
import Link from "next/link";
import {setAuthTokenRequest} from "../lib/setAuthTokenRequest";

const USER_VERIFICATION = gql`
    mutation verification($token: String!) {
        userVerification(token: $token) {
            token
            user {
                id
                isVerified
            }
        }
    }
`;

export default function EmailVerificationPage({success}) {
    return (
        <Container className="h-100">
            <CenteredContainer>
                <h3>
                    <T>Verifying email address</T>
                </h3>
                {success ? <Success /> : <Failure /> }
            </CenteredContainer>
        </Container>
    );
}

export const getServerSideProps = withAppContext({
    accessLevel: 'guest',
    callback: async ({query, apolloClient}) => {
        const {t: token = ''} = query;

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            };
        }

        const {data, ...a} = apolloClient.mutate({mutation: USER_VERIFICATION, variables: {token}});
        let success = false;

        console.log(data);

        if (data && data.userVerification.token) {
            success = setAuthTokenRequest(data.userVerification.token);
        }

        return {
            props: {
                success
            }
        };
    }
});

const Failure = () => {
    return (
        <>
            <h1 className='text-danger'>
                <T>Failure</T>
            </h1>
            <p>
                <T>This link is incorrect or out of date, go to the authorization page and log in</T>
            </p>
            <p>
                <Link href={'/authorization'} passHref >
                    <a>
                        <T>Go to authorization page</T>
                    </a>
                </Link>
            </p>
        </>
    );
};

const Success = () => {
    return (
        <>
            <h1 className='text-success'>
                <T>Success</T>
            </h1>
            <p >
                <T>Your email has been successfully verified! It remains to fill out the profile</T>
            </p>
            <p>
                <Link href={'/edit-user-profile'} passHref>
                    <a>
                        <T>Go to profile</T>
                    </a>
                </Link>
            </p>
        </>
    );
};