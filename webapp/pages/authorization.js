import {Button, ButtonToolbar, Col, Container, Form, Row} from "react-bootstrap";
import {NavLink, T} from "@components";
import {useTranslation} from "next-i18next";
import {useAuthorizationForm} from "hooks/useAuthorizationForm";
import {useAuth} from "lib/auth";
import Router from "next/router";
import withAppContext from "lib/withAppContext";
import {Fragment} from "react";
import Head from "next/head";
import {LocalizedTitle, Title} from "../components/LocalizedTitle";
import {SiteHead} from "../components/SiteHead";

export default function AuthorizationPage() {
    const {signIn, signUp} = useAuth();
    const { t } = useTranslation();
    const  {password, setPassword, email, setEmail, setFormError, validateInputs, errors} = useAuthorizationForm();

    const onLogIn = (e) => {
        e.preventDefault();

        if (validateInputs()){
            signIn(email, password).then( ({error, success, user}) => {
                if (!success) {
                    setFormError(error);
                } else {
                    Router.push(`/driver/${user.id}`);
                }
            });
        }
    };
    const onSignUp = (e) => {
        e.preventDefault();

        if (validateInputs()) {
            signUp(email, password).then(({error, success}) => {
                if (!success) {
                    setFormError(error);
                } else {
                    Router.push('/success-registration');
                }
            });
        }
    };

    const getErrorAlert = () => {
        if (errors.form !== '') {
            return (
                <div className="alert alert-danger" role="alert">
                    <T>{errors.form}</T>
                </div>
            );
        }
    };

    return (
        <Fragment>
            <SiteHead title={'User authorization'}>
                <meta name="robots" content="noindex"/>
            </SiteHead>
        <Container >
            <Row className="justify-content-center h-100">
                <Col className="col-10 col-sm-9 col-md-7 col-lg-6 col-xl-5 align-items-center pt-5">
                    <h1 className="text-center">
                        <T>Authorization</T>
                    </h1>
                    {getErrorAlert()}
                    <Form >
                        <Form.Group controlId="formGroupEmail" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder={t("Enter email")}
                                onChange={({target}) => setEmail(target.value)}
                                value={email}
                                isInvalid={errors.email !== ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                <T>{errors.email}</T>
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Control
                                type="password"
                                placeholder={t("Password")}
                                onChange={({target}) => setPassword(target.value)}
                                value={password}
                                isInvalid={errors.password !== ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                <T>{errors.password}</T>
                            </Form.Control.Feedback>
                        </Form.Group>
                        <p className="text-center">
                            <NavLink href={'/forgot-password'}>
                                <T>Forgot your password</T>
                            </NavLink>
                        </p>
                        <ButtonToolbar className='justify-content-center'>
                            <Button className="me-1 col-5" onClick={e => onLogIn(e)}>
                                <T>log in</T>
                            </Button>
                            <Button className="ms-1 col-5" onClick={e => onSignUp(e)}>
                                <T>sign up</T>
                            </Button>
                        </ButtonToolbar>
                    </Form>
                </Col>
            </Row>
        </Container>
        </Fragment>
    );
}

export const getServerSideProps = withAppContext({accessLevel: 'guest'});