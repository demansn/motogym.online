import React from 'react';
import {Container} from "react-bootstrap";
import {T} from "@components";
import Link from "next/link";

 export default function Custom404() {
    return (
        <Container className="h-100">
            <div className="row justify-content-center h-75 align-items-center">
                <div className="col-md-12 text-center">
                    <span className="display-1 d-block">404</span>
                    <Link href={'/'}><T>Home</T></Link>
                </div>
            </div>
        </Container>
    );
}
