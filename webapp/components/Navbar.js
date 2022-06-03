import React, {useState} from 'react';
import {Navbar as BootstrapNavbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import {useTranslation} from "next-i18next";
import {T} from "./T";
import Link from 'next/link';
import Router from 'next/router';
import {NavLink} from "./NavLink";
import {LanguageSelector} from "./LanguageSelector";
import {useAuth} from "../lib/auth";

export function Navbar() {
    const { t } = useTranslation();
    const {isSignedIn, signOut} = useAuth();

    const [expanded, setExpanded] = useState(false);

    const toggle = ()=> {
        setExpanded(!expanded);
    };

    return (
        <BootstrapNavbar expanded={expanded} onToggle={toggle} expand="sm" bg="dark" variant="dark" sticky="top" >
            <Container>
                <Link href={'/'} passHref >
                    <BootstrapNavbar.Brand onClick={toggle}>Motogym</BootstrapNavbar.Brand>
                </Link>
                <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
                <BootstrapNavbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink onClick={toggle} href={'/drivers'}>
                            <T>Drivers</T>
                        </NavLink>
                        <NavLink onClick={toggle} href={'/competitions'}>
                            <T>Competitions</T>
                        </NavLink>
                        <NavLink onClick={toggle} href={'/championships'}>
                            <T>Championships</T>
                        </NavLink>
                    </Nav>
                    <Nav  >
                        {isSignedIn() ? <AutorizedUserNavs onClick={toggle} /> : <GuestUserNavs onClick={toggle} />}
                        <LanguageSelector />
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

function AutorizedUserNavs({onClick}) {
    const { t } = useTranslation();
    const {signOut} = useAuth();

    const logout = async () => {
        onClick();
        await signOut();
        await Router.push('/');
    };

    return (
        <NavDropdown title={t('User')} align="end" id={'NavDropdown'}>
            <Link href={'/edit-user-profile'} passHref >
            <NavDropdown.Item onClick={onClick}>
                    <T>Edit profile</T>
            </NavDropdown.Item>
            </Link>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => logout()} >
                <T>Logout</T>
            </NavDropdown.Item>
        </NavDropdown>
    );
}

function GuestUserNavs({onClick}){
    return (
        <NavLink align="end" href={'/authorization'} onClick={onClick} >
            <T>log in</T>
        </NavLink>
    );
}