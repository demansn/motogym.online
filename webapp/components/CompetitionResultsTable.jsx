import {T, CompetitionResultTime, VideoLink} from "@components";
import {Table} from "react-bootstrap";
import Link from "next/link";

export function CompetitionResultsTable({results = []}) {
    return (
        <Table striped bordered hover className='CompetitionResultsTable' >
            <thead >
            <tr>
                <th className="align-middle text-center">
                    <T>Pos</T>
                </th>
                <th className="align-middle text-center">
                    <T>Driver</T>
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
            {results.map(result => <CompetitionResultTableLine key={result.id} result={result}/>)}
            </tbody>
        </Table>
    );
}

function CompetitionResultTableLine({result}) {
    const {user, motorcycle, driver} = result;
    const dr = user || driver;

    return (
        <tr >
            <td className="align-middle text-center">{result.position}</td>
            <td className="">
                <div className="h6">
                    <Link href={`/driver/${dr.id}`} >
                        {`${dr.profile.firstName} ${dr.profile.lastName}`}
                    </Link>
                </div>
                <div>{`${motorcycle.brand} ${motorcycle.model}`}</div>
            </td>
            <td className="align-middle">
                <CompetitionResultTime time={result.time} penalty={result.fine || result.penalty} gap={result.gap} />
            </td>
            <td className="align-middle text-center">
                {result.timeRatio}
            </td>
            <td className="align-middle text-center">
                <VideoLink href={result.video} />
            </td>
        </tr>
    );
}