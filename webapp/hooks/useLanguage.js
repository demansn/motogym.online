import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

export function useLanguage() {
    const {i18n} = useTranslation();
    const router = useRouter();
    const language = i18n.language;
    const { pathname, asPath, query } = router;
    const change = lng => router.push({ pathname, query }, asPath, { locale: lng });

    return [language, change];
}