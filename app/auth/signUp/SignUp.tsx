"use client";

import { signUp } from "@/app/api/client/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { useFormState } from "react-dom";


interface FormValues {
    username: string;
    password: string;
    passwordConfirm: string;
}

type ErrorDict = Partial<FormValues>;

const validate = (
    values: Partial<FormValues>
) => {
    const {
        username, password, passwordConfirm
    } = values;
    const errors: ErrorDict = {};
    if (!username) {
        errors["username"] = "Username is required";
    }
    if (!password) {
        errors["password"] = "Password is required";
    }
    if (password && password !== passwordConfirm) {
        errors["passwordConfirm"] = "Passwords don't match";
    }

    if (Object.keys(errors).length === 0) {
        return null;
    }

    return errors;
};

const ERROR_CLASSES = "text-red-600 text-sm";

export const SignUp = (
    {
        csrfToken,
    }: {
        csrfToken: string;
    }
) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const router = useRouter();

    const signUpCallback = useCallback(
        async (_prevState: unknown, data: FormData) => {
            const username = data.get("username") as string|undefined;
            const password = data.get("password") as string|undefined;
            const passwordConfirm = data.get("password_confirm") as string|undefined;
        
            const messages = validate({
                username,
                password,
                passwordConfirm,
            });
        
            if (messages) {
                return {
                    messages,
                };
            }
        
            try {
                await signUp({
                    username: username!,
                    password: password!,
                });
                
                await signIn("credentials", {
                    username,
                    password,
                    redirect: false,
                });

                router.push("/");
            }
            catch (ex) {
                console.error(ex);
                return {
                    submissionErrorMessage: "There was an error signing up",
                };
            }
        
            return {};
        }, [
            router,
        ]);

    const [state, formAction] = useFormState(signUpCallback, {
    });

    const handleUsernameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setUsername(event.target.value);
        }, [
            setUsername,
        ]
    );

    const handlePasswordChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
        }, [
            setPassword,
        ]
    );

    const handlePasswordConfirmChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setPasswordConfirm(event.target.value);
        }, [
            setPasswordConfirm,
        ]
    );

    return (
        <form
            action={formAction}
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
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <p
                        className={ERROR_CLASSES}
                    >
                        {state.messages?.username ?? <>&nbsp;</>}
                    </p>
                </label>
                <label
                    className="flex flex-col"
                >
                    Password
                    <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <p
                        className={ERROR_CLASSES}
                    >
                        {state.messages?.password ?? <>&nbsp;</>}
                    </p>
                </label>
                <label
                    className="flex flex-col"
                >
                    Confirm Password
                    <input
                        name="password_confirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={handlePasswordConfirmChange}
                    />
                    <p
                        className={ERROR_CLASSES}
                    >
                        {state.messages?.passwordConfirm ?? <>&nbsp;</>}
                    </p>
                </label>
                <button
                    type="submit"
                    className="bg-lime-600 p-2 rounded self-center"
                >
                    Sign up
                </button>
            </div>
        </form>
    );
};
