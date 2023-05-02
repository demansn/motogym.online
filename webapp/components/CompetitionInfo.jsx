import {LineTitle} from "./LineTitle";
import {T} from "./T";
import {TextWithTitle} from "./TextWithTitle";
import Image from "next/legacy/image";
import {Col, Row} from "react-bootstrap";
import {useTranslation} from "next-i18next";

export function CompetitionInfo({competition = {}}) {
    const {i18n} = useTranslation();
    const {type, name, description, racetrack} = competition;
    const textDescription = description[i18n.language];

    return (
        <div className="competition-info-container">
            <LineTitle >
                <T>Competition</T>
            </LineTitle>
            <Row>
                <Col >
                    <TextWithTitle title={'Title'} text={name} />
                    <TextWithTitle title={'Type'} text={type.name} />
                    <TextWithTitle title={'Description'} text={textDescription} />
                </Col>
                <Col sm={12} md={6} lg={5} xl={5} className="col-12">
                    <TextWithTitle title={'Racetrack'} />
                    <Image className="competition-info-racetrack w-100" src={racetrack} width={500} height={500} alt={'racetrack'} />
                </Col>
            </Row>
        </div>
    );
}
