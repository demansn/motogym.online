import React from "react";
import gql from "graphql-tag";
import {Container, Row} from "react-bootstrap";
import {ChampionshipCard} from "components/ChampionshipCard";
import withAppContext from "lib/withAppContext";

export default function CompetitionsPage({championships}) {
    const hasUser = false;

    return (
        <Container className="h-100">
            <Row>
                {championships.map(comp => <ChampionshipCard key={comp.id} championship={comp} />)}
            </Row>
        </Container>
    );
}

const CHAMPIONSHIPS = gql`
    query championships {
        championships {
            id
            name
            rounds {
                name
                finished
            }
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient}) => {
        const {data} = await apolloClient.query({query: CHAMPIONSHIPS});

        return {
            props: {
                championships: data.championships
            }
        };
    }
});