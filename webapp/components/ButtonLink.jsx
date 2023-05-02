import Link from "next/link";
import {Button} from "react-bootstrap";

export function ButtonLink({href, hidden, variant, size, children, isActive}) {
    return (
        <Link href={href} legacyBehavior={true} passHref>
            <Button size={size} variant={variant} hidden={hidden} className={isActive && 'text-primary'} >
                {children}
            </Button>
        </Link>
    );
}
