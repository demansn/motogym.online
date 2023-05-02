import {Container} from "react-bootstrap";
import {T} from "@components";
import withAppContext from "../lib/withAppContext";

export default function SessionExpired() {
    return (
        <Container className="h-100">
            <div className="row justify-content-center h-75 align-items-center">
                <div className="col-md-12 text-center">
                    <span className="display-1 d-block"><T>Session Expired</T></span>
                    <p className="text-center">
                        <T>Please login again or back to home page.</T>
                    </p>
                </div>
            </div>
        </Container>
    );
}

export const getServerSideProps = withAppContext();
