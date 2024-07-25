/** @type {import('next').NextConfig} */

const isGHPages = process.env["GITHUB_ACTIONS"] === "true";

console.log("is Github action?", isGHPages);

const nextConfig = {
    basePath: isGHPages ? "/mosquito_hunter" : undefined, 
};

export default nextConfig;
