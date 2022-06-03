import {ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {T} from "components/T";
import {LineTitle} from "components/LineTitle";
import {TextWithTitle} from "components/TextWithTitle";
import {ResultDate} from "components/ResultDate";
import {ButtonLink} from "components/ButtonLink";
import gql from "graphql-tag";
import withAppContext from "lib/withAppContext";

export default function ChampionshipPage({championship}) {
    const {description, rounds = [], name} = championship;

    return (
        <Container className="h-100">
                <LineTitle >
                    <T>Championship</T>
                </LineTitle>
                <TextWithTitle title={'Title'} text={name} />
                <div className="h5 text-muted textWithTitle-title">
                    <T>Description</T>
                </div>
                <div dangerouslySetInnerHTML={{__html:description}} />
                <LineTitle >
                    <T>Rounds</T>
                </LineTitle>
                <div className="list-group list-group-flush">
                    {rounds.map((round, i) => <RoundListItem key={round.id} round={round} i={i} name={name} />)}
                </div>
        </Container>
    );
}

function RoundListItem({round, i, name}) {
    const now = Date.now();
    const start = new Date(round.start);
    const finish = new Date(round.finish);
    const isAction = now >= start && now <= finish;
    const isDisabled = now < start;
    const classes = isAction ? '' : isDisabled ? 'disabled' : '';
    const status = round.started && !round.finished ? 'Started' : round.finished ? 'Finished' : 'Not started yet';

    return (
        <div className={`list-group-item p-0 pb-2 ${classes}`}>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1"><T>Round</T> {i + 1}</h5>
                <small><T>{status}</T></small>
            </div>
            <Row>
                <Col className={'m-10'}>
                    <Row>
                        <Col xs={12}><small><T>Start date</T> - <ResultDate date={start}/></small></Col>
                        <Col xs={12}><small><T>Finish date</T> - <ResultDate date={finish}/></small></Col>
                    </Row>
                </Col>
                <Col sm={12} md={6} lg={5} xl={5} className="col-12">
                    <ButtonGroup className="col-12 justify-content-center mb-1 p-0 h-100 align-items-end" hidden={isDisabled}>
                        <ButtonLink size='sm' variant="secondary" href={`/championship/${name}/round/${i + 1}`} >
                            <T>More</T>
                        </ButtonLink>
                        {/*{*/}
                        {/*    (!me || !round.started || round.finished) ?*/}
                        {/*        ''*/}
                        {/*        :*/}
                        {/*        (<ButtonLink size='sm' variant="secondary" href={`/add-result-championship-round/?championship=${[name]}&round=${i + 1}`}>*/}
                        {/*            <T>Add result</T>*/}
                        {/*        </ButtonLink>)*/}
                        {/*}*/}
                    </ButtonGroup>
                </Col>
            </Row>
        </div>
    );
}

const GET_CHAMPIONSHIP_INFO = gql`
    fragment ChampionshipInfo on Championship {
        id
        name
        description
        rounds {
            id
            start
            finish
            name
            started
            finished
        }
    }

    query championshipInfo($name: String!) {
        championshipByName(name: $name) {
            ...ChampionshipInfo
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient, query}) => {
        let result = {};
        try {
            result = await apolloClient.query({query: GET_CHAMPIONSHIP_INFO, variables: {name: query.name}});
        } catch (e) {

            return {
                redirect: {
                    destination: '/competition-not-found',
                    permanent: false,
                }
            };
        }
        const {data} = result;

        if (!data || !data.championshipByName) {
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