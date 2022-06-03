import moment from 'moment';

export function ResultDate({date}) {
    const resultDate = moment(new Date(date)).format('DD/MM/YYYY');

    return (
        <>
            {resultDate}
        </>
    );
}