import {T} from "../T";
import Link from "next/link";

export const FailureEmailVerification = () => {
    return (
        <>
            <h1 className='text-danger'>
                <T>Failure</T>
            </h1>
            <p>
                <T>This link is incorrect or out of date, go to the authorization page and log in</T>
            </p>
            <p>
                <Link href={'/authorization'} passHref >
                    <a>
                        <T>Go to authorization page</T>
                    </a>
                </Link>
            </p>
        </>
    );
};
