/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Enable image optimization for production
    unoptimized: false,
    // Configure allowed image domains
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'via.placeholder.com',
      'www.jllhomes.co.in',
      'urbanhousein-images-dev.s3.us-east-1.amazonaws.com',
    ],
    // Image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable lazy loading by default
    loader: 'default',
    // Optimize for performance
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable compression
  compress: true,
  // Optimize for production
  swcMinify: true,
  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Temporarily disabled due to critters dependency issues
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
