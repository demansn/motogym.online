import {useTranslation} from "next-i18next";

export function T({children}) {
    const { t } = useTranslation();

    return <>{t(children)}</>;
}
