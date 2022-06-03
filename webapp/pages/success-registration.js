import withAppContext from "lib/withAppContext";
import {CenteredContainer, T} from "@components";
import {Container} from "react-bootstrap";

export default function SuccessRegistrationPage() {
    return (
        <Container className="h-100">
            <CenteredContainer>
                <h1>
                    <T>You have successfully registered</T>
                </h1>
                <p>
                    <T>A registration confirmation email has been sent to your mail</T>
                </p>
            </CenteredContainer>
        </Container>
    );
}

export const getServerSideProps = withAppContext({accessLevel: 'guest'});