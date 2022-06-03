import {TextWithTitle} from "./TextWithTitle";
import {ButtonGroup, Col, Container} from "react-bootstrap";
import {T} from "./T";
import Image from "next/image";
import championshipIcon from '../public/images/championship_icon.png';
import {ButtonLink} from "./ButtonLink";

export function ChampionshipCard({championship}) {
    const {name} = championship;

    return (
        <Col className='CompetitionCard mb-2 col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4'>
            <Container className='CompetitionCard-container p-2'>
                <TextWithTitle title={'Championship'} text={name} />
                <hr className="CompetitionCard-hr"/>
                <div className="d-flex align-items-center justify-content-center">
                    <Image width={256} height={256} className='CompetitionCard-racetrack' src={championshipIcon} alt={'championshipIcon'}/>
                </div>
                <ButtonGroup className="col-12 justify-content-center mt-2 p-0">
                    <ButtonLink size={'sm'} variant={'secondary'} href={`/championship/${name}`} >
                        <T>More</T>
                    </ButtonLink>
                </ButtonGroup>
            </Container>
        </Col>
    );
}