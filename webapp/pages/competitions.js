import React from "react";
import gql from "graphql-tag";
import {Container, Row} from "react-bootstrap";
import {CompetitionCard} from "components/CompetitionCard";
import withAppContext from "lib/withAppContext";
import {useAuth} from "lib/auth";

export default function CompetitionsPage({competitions}) {
    const {isSignedIn} = useAuth();

    return (
        <Container className="h-100">
            <Row>
                {competitions.map( competition => <CompetitionCard key={competition.id} competition={competition} disableAddResult={!isSignedIn()}/>)}
            </Row>
        </Container>
    );
}

const COMPETITIONS = gql`
    fragment CompetitionCard on Competition {
        id
        name
        type {name}
        racetrack
    }

    query get_competition {
        competitions {
            ...CompetitionCard
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient}) => {
        const {data} = await apolloClient.query({query: COMPETITIONS});

        return {
            props: {
                competitions: data.competitions
            }
        };
    }
});