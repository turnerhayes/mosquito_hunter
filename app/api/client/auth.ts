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

    const response = await fetch("/api/auth/signUp", {
        body: fd,
        method: "POST",
    });

    const responseText = await response.text();

    if (response.status >= 400) {
        throw new Error(responseText || response.statusText);
    }
};
