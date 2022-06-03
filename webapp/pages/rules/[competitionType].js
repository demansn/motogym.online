import {Col, Container} from "react-bootstrap";
import gql from "graphql-tag";
import withAppContext from "lib/withAppContext";

export default function RulesPage({typeCompetition}) {
    return (
        <Container className="h-100">
            <Col>
                <h4 className='text-center'>{typeCompetition.name}</h4>
                <div dangerouslySetInnerHTML={{__html: typeCompetition.regulation}} />
            </Col>
        </Container>
    );
}

const TYPE_COMPETITION = gql`
    fragment TypeCompetitionFragment on TypeCompetition {
        name
        id
        regulation
    }

    query typeCompetition($name: String!) {
        typeCompetition(name: $name) {
            ...TypeCompetitionFragment
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient, query}) => {
        let result = {};
        const {competitionType: name} = query;

        try {
            result = await apolloClient.query({query: TYPE_COMPETITION, variables: {name}});
        } catch (e) {

            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            };
        }
        const {data} = result;

        if (!data || !data.typeCompetition) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            };
        }

        return {
            props: {
                typeCompetition: data.typeCompetition
            }
        };
    }
});