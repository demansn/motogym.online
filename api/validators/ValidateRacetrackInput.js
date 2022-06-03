const Validator = require('validator');

const validateRacetrackInput = function(racetrackInput) {
    const errors = {};
    const validateStringObjectValues = (obj, errors) => {
        for (let key in obj) {
            const value = obj[key];

            // if (typeof value !== "string") {
            //     errors[key] = `Parameter ${key} contains not only String`;
            // }
        }
    };

    try {
        validateStringObjectValues(racetrackInput, errors);

        return Object.keys(errors).length > 0 ? errors : false;
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    validateRacetrackInput
};