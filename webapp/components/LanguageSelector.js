import React from 'react';
import {NavDropdown} from "react-bootstrap";
import Flags from 'country-flag-icons/react/3x2';
import {T} from "./T";
import {useLanguage} from "../hooks/useLanguage";

const languages = {
    "ua": 'ukrainian',
    "ru": 'russian',
    "en": 'english',
    // "ja": 'japanese',
};

const FlagsElements = {
    "ua": <Flags.UA />,
    "ru": <Flags.RU />,
    "en": <Flags.US />,
    "ja": <Flags.JP />
};

function FlagIcon({code}) {
    return (
        <span className={'flag-container'}>
            {FlagsElements[code]}
        </span>
    );
}

function NavDropdownLanguage({lng, active, onSelect}) {
    return (
        <NavDropdown.Item active={active} onClick={() => onSelect(lng)} >
            <FlagIcon code={lng} />
            <span>
                <T>{languages[lng]}</T>
            </span>
        </NavDropdown.Item>
    );
}

function LanguageSelector() {
    const [currentLanguage, changeLanguage] = useLanguage();

    const LANGUAGE_ITEMS = Object.keys(languages).map(lng => {
        return <NavDropdownLanguage key={lng} lng={lng} onSelect={changeLanguage} active={lng === currentLanguage} />;
    });

    return (
        <NavDropdown
            title={<FlagIcon code={currentLanguage} />}
            align="end"
            id={'LanguageSelector'}
        >
            {LANGUAGE_ITEMS}
        </NavDropdown>
    );
}

export { LanguageSelector };