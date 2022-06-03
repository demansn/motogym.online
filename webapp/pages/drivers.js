import {gql} from "@apollo/client";
import {DriverCard} from "components/DriverCard";
import {Container, Row} from "react-bootstrap";
import Router from "next/router";
import withAppContext from "lib/withAppContext";

export default function DriversPage({drivers}) {
    const goToDriverPage = id => Router.push(`/driver/${id}`);
    const driversView = drivers.map(driver => <DriverCard key={driver.id} driver={driver} onClick={goToDriverPage} />);

    return (
        <Container className="h-100" >
            <Row >
                {driversView}
            </Row>
        </Container>
    );
}

const DRIVERS = gql`
    query drivers {
        drivers {
            id
            profile {
                firstName
                lastName
                avatar
                city
                country
            }
        }
    }
`;


export const getServerSideProps = withAppContext({
    callback: async ({apolloClient}) => {
        const {data} = await apolloClient.query({query: DRIVERS});

        return {
            props: {
                drivers: data.drivers
            }
        };
    }
});