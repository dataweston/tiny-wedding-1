const basePath = process.env.NEXT_PUBLIC_BASE_PATH

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://localeffortfood.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://localeffortfood.com https://*.localeffortfood.com http://localhost:*",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
