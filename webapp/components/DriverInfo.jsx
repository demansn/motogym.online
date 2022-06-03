import {Col, Container, Row} from "react-bootstrap";
import Image from "next/image";
import avatarIcon from "public/images/avatar-icon.png";
import {T, LineTitle, TextWithTitle} from "@components";
import get from 'lodash/get';

export function DriverInfo({profile}) {
    return (
        <Container className="col-sm-12 col-md-10 col-lg-8 col-xl-6">
            <LineTitle >
                <T>Biography</T>
            </LineTitle>
            <Row>
                <Col sm={{ order: 1, span: 8 }} md={{ order: 1, span: 8 }} xs={{ order: 2, span: 12 }}>
                    <TextWithTitle title={profile.firstName} text={get(profile, 'lastName', '').toUpperCase()} />
                    <TextWithTitle text={`${profile.city}/${profile.country}`} />
                    <br />
                    <TextWithTitle title="Gender" text={get(profile, 'gender', 'N/A').toUpperCase()} />
                    <TextWithTitle title="Age" text={profile.age} />
                </Col>
                <DriverAvatar src={profile.avatar} />
            </Row>
        </Container>
    );
}

function DriverAvatar({src}) {
    return (
        <Col className="d-flex text-center justify-content-center align-items-center align-content-center"
             sm={{ order: 2, span: 4 }} md={{ order: 2, span: 4 }} xs={{ order: 1, span: 12 }} >
            <Image alt={'avatar icon'} height={400} width={400} src={src || avatarIcon} className="profile-avatar w-75 h-auto" />
        </Col>
    );
}