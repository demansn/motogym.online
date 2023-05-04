export const validateProfileInput = function(profileInput) {
    const errors = {};

    // for(let key in profileInput) {
    //     if (profileInput[key] && !Validator.isAscii(profileInput[key])) {
    //         errors[key] = `Parameter ${key} contains not only ASCII`;
    //     }
    // }

    return Object.keys(errors).length > 0 ? errors : false;
};
