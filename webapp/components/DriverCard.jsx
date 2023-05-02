import {Col, Container, Row} from "react-bootstrap";
import Image from "next/legacy/image";
import defaultAvatarIcon from '../public/images/avatar-icon.png';

export function DriverCard({driver, onClick}) {
    const {id, profile} = driver;
    const {firstName, lastName, city, country, avatar} = profile;

    return (
        <Col id={id} key={id} className="user-info-col driver col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4" onClick={() => onClick(id)}>
            <Container>
                <Row className="driver-card-row">
                    <Col className="user-info" sm={8} md={8} xs={8}>
                        <h6 className="user-info-firstName">{firstName}</h6>
                        <h2 className="user-info-lastName">{lastName}</h2>
                        <h5 className="user-info-whereFrom">{city}/{country}</h5>
                    </Col>
                    <Col className="profile-avatar-container d-flex text-center justify-content-center align-items-center align-content-center" sm={4} md={4} xs={4} >
                        <Image width={200} height={200} src={avatar || defaultAvatarIcon} className="profile-avatar w-100 h-auto" alt={'avatar'} dangerouslyAllowSVG={true} />
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
