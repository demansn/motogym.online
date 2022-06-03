import {Container} from "react-bootstrap";
import {CenteredContainer} from "components/CenteredContainer";
import {T} from "components/T";
import withAppContext from "lib/withAppContext";

export default function CompetitionNotFoundPage() {
    return (
        <Container className="h-100">
            <CenteredContainer>
                <h1>
                    <T>Competition not found</T>
                </h1>
            </CenteredContainer>
        </Container>
    );
}

export const getServerSideProps = withAppContext();