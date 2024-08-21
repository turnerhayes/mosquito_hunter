import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/app";
import { getUser } from "@/app/server/db/authentication";


interface AppSession extends Session {
    user?: NextAuthUser & User;
}

const handler = NextAuth({
    pages: {
        signIn: "/auth/signIn",
    },
    providers: [
        CredentialsProvider({
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                },
                password: {
                    label: "Password:",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const {username, password} = credentials;

                const user = await getUser({
                    username,
                    password,
                });

                return user;
            }
        }),
    ],
    callbacks: {
        jwt({token, user}) {
            const u = user as User;
            if (u) {
                token.username = u.username;
            }
            return token;
        },
        session({session, token}) {
            const appSession = session as AppSession;
            appSession.user!.username = token.username as string;
            return appSession;
        },
    },
});

export { handler as GET, handler as POST };
