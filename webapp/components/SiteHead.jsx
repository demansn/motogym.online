import Head from "next/head";
import {useTranslation} from "next-i18next";

export function SiteHead({title, children}) {
    const { t } = useTranslation();

    return (
        <Head>
            <title>{t(title)}</title>
            {children}
        </Head>
    );
}