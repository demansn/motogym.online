import {T} from "@components";
import Link from "next/link";

export const SuccessEmailVerification = () => {
    return (
        <>
            <h1 className='text-success'>
                <T>Success</T>
            </h1>
            <p >
                <T>Your email has been successfully verified! It remains to fill out the profile</T>
            </p>
            <p>
                <Link href={'/edit-user-profile'} >
                    <T>Go to profile</T>
                </Link>
            </p>
        </>
    );
};
