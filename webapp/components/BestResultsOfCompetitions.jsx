import {Container, Table} from "react-bootstrap";
import {LineTitle} from "./LineTitle";
import {T} from "./T";
import {ResultDate} from "./ResultDate";
import {NavLink} from "./NavLink";
import {CompetitionResultTime} from "./CompetitionResultTime";
import {ResultVideo} from "./ResultVideo";

export function BestResultsOfCompetitions(props) {
    let competitions = props.competitions.filter( competition => competition.results.length > 0);

    competitions = competitions.sort( (a, b) => {
        const dateA = new Date(a.results[0].date);
        const dateB = new Date(b.results[0].date);
        if (dateA < dateB) {
            return 1;
        } else if (dateA > dateB) {
            return -1;
        }
        return 0;
    });

    return (
        <Container className="col-sm-12 col-md-10 col-lg-8 col-xl-6">
            <LineTitle >
                <T>Best results of competition</T>
            </LineTitle>
            <Table striped bordered hover className='CompetitionResultsTable' >
                <thead >
                <tr>
                    <th className="align-middle text-center">
                        <T>Date</T>
                    </th>
                    <th className="align-middle text-center">
                        <T>Competition</T>
                    </th>
                    <th className="align-middle text-center">
                        <T>Motorcycle</T>
                    </th>
                    <th className="align-middle text-center">
                        <T>Time</T>
                    </th>
                    <th className="align-middle text-center">
                        <T>Time ratio</T>
                    </th>
                    <th className="align-middle text-center">
                        <T>Video</T>
                    </th>
                </tr>
                </thead>
                <tbody>
                {competitions.map(competition => <BestResultsOfCompetitionsTableLine key={competition.id} competition={competition} />)}
                </tbody>
            </Table>
        </Container>
    );
}

function BestResultsOfCompetitionsTableLine({competition}) {
    const {name, results, id} = competition;
    const {motorcycle, date, time, fine, gap, timeRatio, video} = results[0];

    return (
        <tr key={id} >
            <td className="align-middle text-center">
                <ResultDate date={date}/>
            </td>
            <td className="align-middle text-center">
                <NavLink href={`/competition/${id}`} >
                    {name}
                </NavLink>
            </td>
            <td className="align-middle text-center">
                {`${motorcycle.brand} ${motorcycle.model}`}
            </td>
            <td className="align-middle">
                <CompetitionResultTime time={time} penalty={fine} gap={gap} />
            </td>
            <td className="align-middle text-center">
                {timeRatio}
            </td>
            <td className="align-middle text-center">
                <ResultVideo video={video}/>
            </td>
        </tr>
    );
}