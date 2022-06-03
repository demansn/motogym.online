import {gql} from "@apollo/client";
import {DriverInfo} from "components/DriverInfo";
import {BestResultsOfCompetitions} from "components/BestResultsOfCompetitions";
import withAppContext from "lib/withAppContext";

export default function DriverPage({driver, competitions}) {
    return (
        <div>
            <DriverInfo profile={driver.profile} />
            <BestResultsOfCompetitions competitions={competitions} />
        </div>
    );
}

const DRIVER = gql`
    query user($id: ID!) {
        user(id: $id) {
            id
            email
            profile {
                firstName
                lastName
                birthday
                gender
                city
                country
                avatar
                age
            }
            motorcycles {
                id
                name
                model
                brand
                productionYear
            }
        }
        competitions {
            id
            name
            results(filter: {user: $id best: true}) {
                gap
                time
                timeRatio
                fine
                date
                video
                motorcycle {
                    model
                    brand
                }
            }
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient, query}) => {
        const {data} = await apolloClient.query({query: DRIVER, variables: {id: query.id}});

        return {
            props: {
                driver: data.user,
                competitions: data.competitions
            }
        };
    }
});