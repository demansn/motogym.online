export const validateCompetitionInput = function(competitionInput) {
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
        validateStringObjectValues(competitionInput, errors);

        return Object.keys(errors).length > 0 ? errors : false;
    } catch (e) {
        console.error(e);
    }
};
