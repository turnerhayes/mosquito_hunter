/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = isProd ? ({
    basePath: isProd ? "/mosquito_hunter" : undefined,
}) : {};

export default nextConfig;
