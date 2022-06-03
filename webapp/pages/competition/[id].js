import gql from "graphql-tag";
import {Container} from "react-bootstrap";
import {T} from "components/T";
import {LineTitle} from "components/LineTitle";
import {CompetitionResultsTable} from "components/CompetitionResultsTable";
import {CompetitionInfo} from "components/CompetitionInfo";
import {useAuth} from "lib/auth";
import {CompetitionNavTabs} from "@components";
import withAppContext from "lib/withAppContext";
import {SiteHead} from "../../components/SiteHead";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

export default function CompetitionPage({competition, host}) {
    const {isSignedIn} = useAuth();
    const {i18n, t} = useTranslation();
    const textDescription = competition.description[i18n.language];
    const router = useRouter();
    const pageUrl = `${host}/${router.locale}${router.asPath}`;

    return (
        <>
        <SiteHead title={`Competition - ${competition.name}`}>
            <meta name="description" content={textDescription} />

            <meta property="og:url" content={pageUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${t('Competition')} - (${competition.name})`} />
            <meta property="og:description" content={textDescription} />
            <meta property="og:image" content={competition.racetrack} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content={host} />
            <meta property="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={`${t('Competition')} - (${competition.name})`} />
            <meta name="twitter:description" content={textDescription} />
            <meta name="twitter:image" content={competition.racetrack} />
        </SiteHead>
        <Container className="h-100">
            <CompetitionNavTabs competitionId={competition.id} competitionType={competition.type.name} hiddenAddResult={!isSignedIn()}/>
            <CompetitionInfo competition={competition} />
            <LineTitle >
                <T>The best results of pilots</T>
            </LineTitle>
            <CompetitionResultsTable results={competition && competition.results} />
        </Container>
        </>
    );
}

const GET_COMPETITION = gql`
    fragment CompetitionInfo on Competition {
        id
        name
        type {
            name
        }
        description {
            en
            ru
            ua
            ja
        }
        racetrack,
        results(filter: {best: true}) {
            id
            date
            time
            fine
            timeRatio
            totalTime
            totalTimeMilliseconds
            gap
            position
            user {
                id
                profile {
                    lastName
                    firstName
                }
            }
            motorcycle {
                brand
                model
            }
            video
        }
    }

    query competition($id: ID!) {
        competition(id: $id) {
            ...CompetitionInfo
        }
    }
`;

export const getServerSideProps = withAppContext({
    callback: async ({apolloClient, query}) => {
        let result = {};
        try {
            result = await apolloClient.query({query: GET_COMPETITION, variables: {id: query.id}});
        } catch (e) {

            return {
                redirect: {
                    destination: '/competition-not-found',
                    permanent: false,
                }
            };
        }
        const {data} = result;

        if (!data || !data.competition) {
            return {
                redirect: {
                    destination: '/competition-not-found',
                    permanent: false,
                }
            };
        }

        return {
            props: {
                competition: data.competition
            }
        };
    }
});

