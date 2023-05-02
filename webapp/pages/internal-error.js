import React from 'react';
import {Container} from "react-bootstrap";
import {T} from "@components";
import withAppContext from "../lib/withAppContext";

 export default function Custom500() {
    return (
        <Container className="h-100">
            <div className="row justify-content-center h-75 align-items-center">
                <div className="col-md-12 text-center">
                    <span className="display-1 d-block">Internal error.</span>
                    <p class={'text-center'}>
                        <T>Got to home</T>
                    </p>
                </div>
            </div>
        </Container>
    );
}

export const getServerSideProps = withAppContext();
