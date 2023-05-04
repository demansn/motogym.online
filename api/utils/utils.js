import moment from 'moment';
import bcrypt from 'bcryptjs';

export * from './JWTUtils.js';

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
}

export async function comparePasswords(passwordA, passwordB) {
    return await bcrypt.compare(passwordA, passwordB);
}

function decimalAdjust(type, value, exp) {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Десятичное округление к ближайшему
const round10 = function(value, exp) {
    return decimalAdjust('round', value, exp);
};

const stringTimeToMilliseconds = function(time) {
    let times = time.split(":");

    if (times[2].length === 2) {
        times[2] = times[2] + '0';
    }

    if (times[2].length === 1) {
        times[2] = times[2] + '00';
    }

    times = times.map(Number);

    let milliseconds = times[2];

    return moment(0)
        .minutes(times[0])
        .seconds(times[1])
        .milliseconds(milliseconds)
        .toDate()
        .getTime();
};

export const millisecondsToStringTime = function(milliseconds) {
    const time = moment(milliseconds);

    return `${time.minutes()}:${time.seconds()}:${time.milliseconds()}`
}

export const sortByTime = function(resultA, resultB) {
    const timeA = stringTimeToMilliseconds(resultA.time);
    const timeB = stringTimeToMilliseconds(resultB.time);

    if (timeA > timeB) {
        return 1;
    } else if (timeA < timeB) {
        return - 1;
    }
    return 0;
};

export const getGapTime = function(timeA, timeB) {
    timeA = stringTimeToMilliseconds(timeA);
    timeB = stringTimeToMilliseconds(timeB);

    return round10((timeA / timeB * 100), -3);
};
