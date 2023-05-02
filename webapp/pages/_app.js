import '../styles/globals.css';
import '../styles/CompetitionCard.css';
import '../styles/CompetitionInfo.css';
import '../styles/CompetitionResultsTableStyle.css';
import '../styles/CompetitionResultTimeStyle.css';
import '../styles/PersonalResults.css';
import '../styles/Driver.css';
import '../styles/RacetrackMapInput.css';
import '../styles/RacetrackSelect.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { appWithTranslation } from 'next-i18next';
import {SSRProvider} from "react-bootstrap";
import Layout from "components/Layout";
import {AuthProvider} from 'lib/auth.js';
import nextI18NextConfig from '../next-i18next.config.js';
import {ModalQuestionProvider} from "components/ModalQuestion";

function MyApp({ Component, pageProps }) {
    const ComponentLayout = Component.layout || Layout;

    return (
        <SSRProvider>
            <ModalQuestionProvider >
                <AuthProvider accessToken={pageProps.accessToken}>
                    <ComponentLayout >
                        <Component {...pageProps} />
                    </ComponentLayout>
                </AuthProvider>
            </ModalQuestionProvider>
        </SSRProvider>
    );
}
export default appWithTranslation(MyApp, nextI18NextConfig);
