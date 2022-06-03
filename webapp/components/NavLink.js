import {useRouter} from "next/router";
import Link from "next/link";
import {Nav} from "react-bootstrap";

export function NavLink({href, onClick, children, className = ''}){
    const {asPath} = useRouter();
    const isActive = asPath === href;

    return (
        <Link href={href} passHref >
            <Nav.Link active={isActive} onClick={onClick} className={className}>
                {children}
            </Nav.Link>
        </Link>
    );
}