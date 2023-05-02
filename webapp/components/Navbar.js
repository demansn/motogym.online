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
    const {isSignedIn} = useAuth();

    const [expanded, setExpanded] = useState(false);

    const toggle = ()=> {
        setExpanded(!expanded);
    };

    return (
        <BootstrapNavbar expanded={expanded} onToggle={toggle} expand="sm" bg="dark" variant="dark" sticky="top" >
            <Container>
                <BootstrapNavbar.Brand to={Link} href={'/'} onClick={toggle}>Motogym</BootstrapNavbar.Brand>
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
                        {isSignedIn() ? <AuthorizedUserNavs onClick={toggle} /> : <GuestUserNavs onClick={toggle} />}
                        <LanguageSelector />
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

function AuthorizedUserNavs({onClick}) {
    const { t } = useTranslation();
    const {signOut} = useAuth();

    const logout = async () => {
        onClick();
        await signOut();
        await Router.push('/');
    };

    return (
        <NavDropdown title={t('User')} align="end" id={'NavDropdown'}>
            <NavDropdown.Item onClick={onClick} to={Link} href={'/edit-user-profile'} >
                    <T>Edit profile</T>
            </NavDropdown.Item>
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
