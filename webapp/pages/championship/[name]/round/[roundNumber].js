import {ButtonGroup, Container} from "react-bootstrap";
import {ButtonLink} from "components/ButtonLink";
import {T} from "components/T";
import {LineTitle} from "components/LineTitle";
import gql from "graphql-tag";
import {useRouter} from "next/router";
import {ChampionshipRoundInfo} from "@components";
import withAppContext from "lib/withAppContext";

export default function ChampionshipRoundPage({championship}) {
    const router = useRouter();
    const { roundNumber } = router.query;
    const {name} = championship;
    const round = championship.rounds[0];
    const hasAddResult = true;

    console.log(championship);

    return (
        <Container className="h-100">
            <ButtonGroup className="col-12 justify-content-center mb-1 p-0">
                    <ButtonLink size='sm' variant="secondary" href={`/championship/${name}`}>
                        <T>About championship</T>
                    </ButtonLink>
                    <ButtonLink size='sm' variant="secondary" href={`/rules/Championship%20-%20online`}>
                        <T>Rules</T>
                    </ButtonLink>
                    <ButtonLink size='sm' hidden={hasAddResult} variant="secondary" href={`../../add-result-championship-round/?championship=${name}&round=${roundNumber}`} >
                        <T>Add result</T>
                    </ButtonLink>
                </ButtonGroup>
            <LineTitle >
                <T>Championship</T> - {name} <T>Round</T> - {roundNumber}
            </LineTitle>
            <ChampionshipRoundInfo round={round} />
        </Container>
    );
}

const CHAMPIONSHIP_ROUND = gql`
    query championshipInfo($name: String! $roundNumber: Int!) {
        championshipByName(name: $name) {
            name
            id
            rounds(filter: {number: $roundNumber}) {
                racetrack
                id
                name
                start
                finish
                started
                finished
                results(filter: {best: true}) {
                    time
                    penalty
                    video
                    gap
                    timeRatio
                    position
                    motorcycle {
                        brand
                        model
                    }
                    driver {
                        id
                        profile {
                            firstName
                            lastName
                        }
                    }
                }
            }
        }
    }
`;

export const getServerSideProps = withAppContext({
    accessLevel: 'user',
    callback: async ({apolloClient, query}) => {
        let result = {};
        const {name, roundNumber} = query;
        console.log(query);

        try {
            result = await apolloClient.query({query: CHAMPIONSHIP_ROUND, variables: {name, roundNumber: Number(roundNumber) - 1}});
        } catch (e) {

            return {
                redirect: {
                    destination: '/competition-not-found',
                    permanent: false,
                }
            };
        }
        const {data} = result;

        if (!data || !data.championshipByName || data.championshipByName.rounds.length === 0) {
            return {
                redirect: {
                    destination: '/competition-not-found',
                    permanent: false,
                }
            };
        }

        return {
            props: {
                championship: data.championshipByName
            }
        };
    }
});