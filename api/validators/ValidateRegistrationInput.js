const Validator = require('validator');

const validateRegistrationInput = function({email = '', password = ''}) {
    const errors = {};

    if (Validator.isEmpty(email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    return Object.keys(errors).length > 0 ? errors : false;
};

module.exports.validateRegistrationInput = validateRegistrationInput;