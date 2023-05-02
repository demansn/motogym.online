import {CenteredContainer, T, SuccessEmailVerification, FailureEmailVerification} from "@components";
import {Container} from "react-bootstrap";
import withAppContext from "lib/withAppContext";
import {authRequest} from "lib/utils";

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
    callback: async ({query}) => {
        const {t: token = ''} = query;

        if (!token) {
            return {redirect: {destination: '/', permanent: false}};
        }

        const {status} = await authRequest('user-verification', {token});
        const success = status === 'ok';

        return {props: {success}};
    }
});
