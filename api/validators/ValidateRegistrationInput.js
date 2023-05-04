import Validator from 'validator';
export const validateRegistrationInput = function({email = '', password = ''}) {
    const data = {code: '', error: '', status: ''};

    if (Validator.isEmpty(email)) {
        return {code: 1, error: 'Email field is required', status: 'notValidInput'};
    }

    if (!Validator.isEmail(email)) {
        return {code: 2, error: 'Email is invalid', status: 'notValidInput'};
    }

    if (Validator.isEmpty(password)) {
        return {code: 3, error: 'Password field is required', status: 'notValidInput'};
    }

    if (!Validator.isLength(password, {min: 6, max: 30})) {
        return {code: 4, error: 'Password must be at least 6 characters', status: 'notValidInput'};
    }

    return undefined;
};
