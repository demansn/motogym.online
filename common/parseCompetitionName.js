const CompetitionNameRegExpTest = /^[A-Za-z][A-Za-z0-9_]{1,29}$/;

export function parseCompetitionName(value) {
    if (typeof value === 'number') {
        value = value.toString();
    }

    if (!CompetitionNameRegExpTest.test(value)) {
        throw new Error('The name contains invalid characters!');
    }

    return value;
}
