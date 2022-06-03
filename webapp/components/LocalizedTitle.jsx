import {useTranslation} from "next-i18next";
import Head from "next/head";

export function LocalizedTitle({children}) {
    const { t } = useTranslation();

    return (
        <Head>
            <title>{t(children)}</title>
        </Head>
    );
}