export const signUp = async (
    {
        username,
        password,
    }: {
        username: string;
        password: string;
    }
) => {
    const fd = new FormData();
    fd.set("username", username);
    fd.set("password", password);

    await fetch("/api/auth/signUp", {
        body: fd,
        method: "POST",
    });
};
