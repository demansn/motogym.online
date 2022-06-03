import {useState} from "react";
import Validator from "validator";

export function useAuthorizationForm() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setError] = useState({
        email: '',
        password: '',
        form: ''
    });
    const setFormError = (form) => {
        setError({email: '', password: '', form});
    };

    const validateInputs = () => {
        const errors = {
            email: '',
            password: '',
            form: ''
        };

        if(!email || !Validator.isEmail(email)) {
            errors.email = 'Please enter an email address';
        }

        if (password === '') {
            errors.password = 'Please enter a password';
        }

        setError(errors);

        return Object.values(errors).every(value => value === '');
    };

    return {
        errors,
        setFormError,
        validateInputs,
        password,
        setPassword,
        email,
        setEmail,
    };
}