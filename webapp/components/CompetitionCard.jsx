import {TextWithTitle} from "./TextWithTitle";
import {Button, ButtonGroup, Col, Container} from "react-bootstrap";
import {T} from "./T";
import Image from "next/legacy/image";
import Link from "next/link";

export function CompetitionCard(props) {
    const {
        competition,
        disableAddResult
    } = props;
    const {id, name, type, racetrack} = competition;

    return (
        <Col className='CompetitionCard mb-2 col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4'>
            <Container className='CompetitionCard-container p-2'>
                <TextWithTitle title={type.name} text={name} />
                <hr className="CompetitionCard-hr"/>
                <div className="d-flex align-items-center justify-content-center">
                    <Image width={500} height={500} className='CompetitionCard-racetrack' src={racetrack} alt={'racetrack'}/>
                </div>
                <ButtonGroup className="col-12 justify-content-center mb-1 p-0">
                    <LinkButton href={`/competition/${id}`} >
                        <T>More</T>
                    </LinkButton>
                    <LinkButton hidden={disableAddResult} href={`/competition/${id}/add-result`} >
                        <T>Add result</T>
                    </LinkButton>
                </ButtonGroup>
            </Container>
        </Col>
    );
}

function LinkButton({href, hidden, children}) {
    return (
        <Link href={href} legacyBehavior={true}>
            <Button size='sm' variant="secondary" hidden={hidden}>
                {children}
            </Button>
        </Link>
    );
}
