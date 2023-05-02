import Image from "next/legacy/image";
import {TextWithTitle} from "./TextWithTitle";
import {CompetitionResultsTable} from "./CompetitionResultsTable";

export function ChampionshipRoundInfo({round}) {
    return (
        <div className="competition-info-container">
            <TextWithTitle title={'Title of round'} text={round.name} />
            <TextWithTitle title={'Racetrack'} />
            <Image className="competition-info-racetrack" width={512} height={512} src={round.racetrack} alt={'racetrack'}/>
            <CompetitionResultsTable results={round.results} />
        </div>
    );
}
