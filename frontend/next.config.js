/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://social-connect-pi.vercel.app/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig