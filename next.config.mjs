/** @type {import('next').NextConfig} */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig = {
  images: {
    // Enable image optimization for better performance
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "theme.hstatic.net",
      },
      {
        protocol: "https",
        hostname: "c4.wallpaperflare.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize image formats
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.hanmade.space/api/v1/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://api.hanmade.space/api/:path*",
      },
    ];
  },
};

export default nextConfig;
