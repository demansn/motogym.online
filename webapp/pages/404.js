import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {useRouter} from "next/router";
import {T} from "@components";
import {useTranslation} from "next-i18next";

 export default function Custom404() {
     const { locale } = useRouter();
     const {  i18n } = useTranslation();
     // const {  re, setRe } = useState(false);
     //
     // useEffect(() => {
     //     // if (i18n && i18n.addResourceBundle) {
     //         i18n.addResourceBundle(locale);
     //         i18n.changeLanguage(locale).then(() => setRe(true) );
     //     // }
     //
     // },  []);

    return (
        <Container className="h-100">
            <div className="row justify-content-center h-75 align-items-center">
                <div className="col-md-12 text-center">
                    <span className="display-1 d-block">404</span>
                    <T>Home</T>
                </div>
            </div>
        </Container>
    );
}

Custom404.layout = ({ children }) => {
    return (<main>{children}</main>);
};