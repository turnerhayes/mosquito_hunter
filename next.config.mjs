/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = isProd ? ({
    basePath: "/mosquito_hunter",
}) : {};

export default nextConfig;
