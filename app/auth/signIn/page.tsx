"use server";

import { getCsrfToken } from "next-auth/react";
import { cookies } from "next/headers";
import Link from "next/link";

const SignInPage = async () => {
    const csrfToken = await getCsrfToken({
        req: {
            headers: {
                cookie: cookies().toString(),
            },
        },
    });

    return (
        <form
            method="post"
            action="/api/auth/callback/credentials"
            className="flex items-center justify-center"
        >
            <div
                className="flex flex-col gap-3"
            >

                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label
                    className="flex flex-col"
                >
                    Username
                    <input name="username" type="text" />
                </label>
                <label
                    className="flex flex-col"
                >
                    Password
                    <input name="password" type="password" />
                </label>
                <button
                    type="submit"
                    className="bg-lime-600 p-2 rounded self-center"
                >
                    Sign in
                </button>
                <div>
                    Don&apos;t have an account? <Link
                        href="/auth/signUp"
                        className="underline text-blue-600"
                    >Sign up!</Link>
                </div>
            </div>
        </form>
    );
};

export default SignInPage;