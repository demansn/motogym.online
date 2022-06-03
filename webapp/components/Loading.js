import React, {Fragment} from "react";
import {Container, Row, Col} from "react-bootstrap";
import wheelImage from 'public/images/wheel-icon.png';
import Image from "next/image";

export function Loading({loading, children}) {
    const SpinnerComponent = (
        <Container className='h-100 align-items-center align-content-center d-flex justify-content-center' >
            <Row className="">
                <Col className='text-center'>
                    <Image className='wheel-spinner' alt='wheel' src={wheelImage} width={100} height={100} />
                </Col>
            </Row>
        </Container>
    );

    return <Fragment>{loading ? SpinnerComponent : children}</Fragment>;
}