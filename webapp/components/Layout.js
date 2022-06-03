import {Container} from "react-bootstrap";
import {Navbar} from "./Navbar";
import {ModalQuestion} from "./ModalQuestion";

export default function Layout({ children }) {
    return (
        <>
            <Container fluid className='vert-align sticky-top p-0 m-0 mb-2'>
                <Navbar />
            </Container>
            <main>{children}</main>
            <ModalQuestion />
        </>
    );
}