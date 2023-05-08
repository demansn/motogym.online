import {CenteredContainer, T} from "@components";
import {Button, Container, Form} from "react-bootstrap";
import {useTranslation} from "next-i18next";
import {useState} from "react";
import validator from "validator";
import withAppContext from "lib/withAppContext";
import {useLanguage} from "../hooks/useLanguage";
import {useAuth} from "../lib/auth";

const ValidateEmail = function(email) {
    return email && validator.isEmail(email);
};

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [invalidEmail, setInvalidEmail] = useState('');
    const [status, setStatus] = useState('');
    const [locale] = useLanguage();
    const {forgotPassword} = useAuth();

    const onClickResetBtn = async () => {
        if (!ValidateEmail(email)) {
            setInvalidEmail('Please enter an email address');
            return;
        }
        setInvalidEmail('');

        const {status} = await forgotPassword({email, resetPasswordLink: `${location.origin}/${locale}/reset-password`});

        setStatus(status === 'ok' ? 'success' : 'error');
    };

    const alert = () => {
        if (status) {
            return status === 'success' ? <SuccessAlert /> : <ErrorAlert />;
        } else {
            return null;
        }
    };

    return (
        <Container className="h-100">
            <CenteredContainer>
                <div className='text-center h1'>
                    <T>Password recovery</T>
                </div>
                <p className="text-center">
                    <T>To recover the password, you must send a request</T>
                </p>
                <p className="text-center">
                    <T>After that, you will receive an email with a link to create a new password</T>
                </p>
                <Form className="col-6 offset-3">
                    {alert()}
                    <Form.Group controlId="formGroupEmail" className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder={t("Enter email")}
                            onChange={({target}) => setEmail(target.value)}
                            value={email}
                            isInvalid={invalidEmail !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            <T>{invalidEmail}</T>
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="w-100" onClick={onClickResetBtn}>
                        <T>Reset password</T>
                    </Button>
                </Form>
            </CenteredContainer>
        </Container>
    );
}

function ErrorAlert() {
    return (
        <div className="alert alert-danger">
            <T>No user with this email</T>
        </div>
    );
}

function SuccessAlert() {
    return (
        <div className="alert alert-success">
            <T>You have successfully sent a password reset request</T>
        </div>
    );
}

export const getServerSideProps = withAppContext({accessLevel: 'guest'});
