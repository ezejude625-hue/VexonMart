/** @type {import('next').NextConfig} */

// ============================================================
// NEXT.JS CONFIGURATION — next.config.js
// ============================================================

const nextConfig = {
  // Allow images from any HTTPS host (tighten in production)
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // React strict mode — catches common bugs early
  reactStrictMode: true,

  // CORS + security headers for all API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true'                             },
          { key: 'Access-Control-Allow-Origin',      value: '*'                                },
          { key: 'Access-Control-Allow-Methods',     value: 'GET,DELETE,PATCH,POST,PUT'       },
          { key: 'Access-Control-Allow-Headers',     value: 'Content-Type, Authorization'     },
        ],
      },
    ]
  },
}

module.exports = nextConfig
