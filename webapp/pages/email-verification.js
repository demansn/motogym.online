import {CenteredContainer, T, SuccessEmailVerification, FailureEmailVerification} from "@components";
import {Container} from "react-bootstrap";
import withAppContext from "lib/withAppContext";
import {gql} from "@apollo/client";
import {setCookies} from "cookies-next";

export default function EmailVerificationPage({success}) {
    return (
        <Container className="h-100">
            <CenteredContainer>
                <h3>
                    <T>Verifying email address</T>
                </h3>
                {success ? <SuccessEmailVerification /> : <FailureEmailVerification /> }
            </CenteredContainer>
        </Container>
    );
}

EmailVerificationPage.layout = ({ children }) => {
    return (<main>{children}</main>);
};

export const getServerSideProps = withAppContext({
    accessLevel: 'guest',
    callback: async ({query, apolloClient, req, res}) => {
        const {t: token = ''} = query;

        if (!token) {
            return {redirect: {destination: '/', permanent: false}};
        }

        const {data} = await apolloClient.mutate({mutation, variables: {token}});
        const success = Boolean(data && data.userVerification.token);
        const authToken = success ? data.userVerification.token : '';

        if (success) {
            setCookies('authToken', authToken, {req, res});
        }

        return {props: {success, authToken}};
    }
});

const mutation = gql`
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
