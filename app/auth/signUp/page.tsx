"use server";

import { getCsrfToken } from "next-auth/react";
import { cookies } from "next/headers";
import { SignUp } from "./SignUp";

const SignInPage = async () => {
    const csrfToken = await getCsrfToken({
        req: {
            headers: {
                cookie: cookies().toString(),
            },
        },
    });

    if (!csrfToken) {
        return (
            <>
            </>
        );
    }

    return (
        <SignUp
            csrfToken={csrfToken}
        />
    );
};

export default SignInPage;