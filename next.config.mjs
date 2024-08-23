/** @type {import('next').NextConfig} */
const nextConfig = {
    // Autorise les images venant de ...
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.BLOB_HOSTNAME}`,
                port: '',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
