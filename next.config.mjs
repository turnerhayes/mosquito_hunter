/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

let nextConfig = {};

if (isProd) {
    nextConfig = ({
        basePath: "/mosquito_hunter",
    });
}

export default nextConfig;
