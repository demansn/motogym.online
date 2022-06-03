const moment = require('moment');

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
    return toMomentTime(time).getTime();
};

const momentToStringResultTime = (momentTime) => {
    return momentTime.format('mm:ss:SSS');
}

const toMomentTime = function(time) {
    let times = String(time).split(":");

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
        .milliseconds(milliseconds);
};

const sortByTime = function(resultA, resultB) {
    const timeA = stringTimeToMilliseconds(resultA.time);
    const timeB = stringTimeToMilliseconds(resultB.time);

    if (timeA > timeB) {
        return 1;
    } else if (timeA < timeB) {
        return - 1;
    }
    return 0;
};


class CompetitionResultTime {
    value;
    constructor(value) {
        this.value = toMomentTime(value);
    }

    addSeconds(seconds) {
        this.value.add(seconds, 's');

        return this;
    }

    clone() {
        return CompetitionResultTime.fromMilliseconds(this.toMilliseconds());
    }

    toMilliseconds() {
        return this.value.toDate().getTime();
    }

    gap(time) {
        return new this.gapMilliseconds(time);
    }

    gapMilliseconds(time) {
        const timeA = this.toMilliseconds();
        const timeB = time.toMilliseconds();

        return round10((timeA / timeB * 100), -3);
    }

    toString() {
        return momentToStringResultTime(this.value);
    }

    static fromMilliseconds(milliseconds) {
        const time = momentToStringResultTime(moment(0).milliseconds(milliseconds));

        return new CompetitionResultTime(time);
    }

    static round10(value, exp) {
        return decimalAdjust('round', value, exp);
    }
}

module.exports = CompetitionResultTime;
