import {CenteredContainer, T} from "@components";
import {Button, Container, Form} from "react-bootstrap";
import {useTranslation} from "next-i18next";
import {useState} from "react";
import withAppContext from "lib/withAppContext";
import {useAuth} from "lib/auth";
import {useRouter} from "next/router";

export default function ResetPasswordPage() {
    const {t} = useTranslation();
    const [password, setPassword] = useState('');
    const [invalidPassword, setInvalidPassword] = useState('');
    const {resetPassword} = useAuth();
    const router = useRouter();
    const { t: token } = router.query;
    const [resetPasswordStatus, setStatus] = useState('');

    const onClickSetNewPassword = async () => {
        setInvalidPassword('');

        if (password && password.length >= 8) {
            const {status} = await resetPassword(token, password);

            setStatus(status);

        } else {
            setInvalidPassword('Password required field and it must be at least 8 characters');
        }
    };

    const FormContent = () => (
        <>
            <Form.Group controlId="formGroupEmail" className="mb-3">
                <Form.Control
                    type="password"
                    placeholder={t("Enter new password")}
                    onChange={({target}) => setPassword(target.value)}
                    value={password}
                    isInvalid={invalidPassword !== ''}
                />
                <Form.Control.Feedback type="invalid">
                    <T>{invalidPassword}</T>
                </Form.Control.Feedback>
            </Form.Group>
            <Button className="w-100" onClick={onClickSetNewPassword}>
                <T>Set new password</T>
            </Button>
        </>
    )


    return (
        <Container className="h-100">
            <CenteredContainer>
                <h3>
                    <T>New password</T>
                </h3>
                <Form className="col-6 offset-3">
                    <MessageByStatus status={resetPasswordStatus} />
                    <Form.Group controlId="formGroupEmail" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder={t("Enter new password")}
                            onChange={({target}) => setPassword(target.value)}
                            value={password}
                            isInvalid={invalidPassword !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            <T>{invalidPassword}</T>
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="w-100" onClick={onClickSetNewPassword}>
                        <T>Set new password</T>
                    </Button>
                </Form>
            </CenteredContainer>
        </Container>
    );
}

function MessageByStatus({status}) {
    if (status === 'error') {
        //ссылка не действительная или устарела
        return (
            <div className="alert alert-danger">
                <T>Link is invalid or expired</T>
            </div>
        );
    } else if (status === 'notVerified') {
        //вы успешно востановили пароль но email пользовотеля не подтвержден
        //подвердите email пользователя
        return (
            <div className="alert alert-info">
                <T>You have successfully reset your password but the user's email has not been verified</T>
                <T>A link has been sent to your mail to confirm the mail</T>
            </div>
        );
    } else if (status === 'success') {
        //вы успешно устновили новый пароль
        return (
            <div className="alert alert-success">
                <T>You have successfully set a new password</T>
            </div>
        );
    }

    return null;
}

export const getServerSideProps = withAppContext({accessLevel: 'guest'});
