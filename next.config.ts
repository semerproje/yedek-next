import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint Configuration
  eslint: {
    ignoreDuringBuilds: true, // Allow build to succeed with warnings
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript error checking
  },
  
  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // emotion: true, // Disabled globally - use per-component when needed
  },

  // Ultra Premium Performance Optimizations
  experimental: {
    // PPR removed for stable version
    optimizePackageImports: ['react', 'react-dom', 'firebase', 'lucide-react'],
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
    // typedRoutes: true, // Will be enabled when Turbopack fully supports it
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'INP', 'TTFB'],
    optimizeCss: true,
    scrollRestoration: true
  },

  // Turbopack Configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
    },
  },

  // Server external packages
  serverExternalPackages: ['firebase-admin'],

  // Ultra Premium Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'api.aa.com.tr',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.aa.com.tr',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**'
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Performance Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600'
          }
        ]
      }
    ];
  },

  // Google News and SEO Rewrites
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      {
        source: '/rss.xml',
        destination: '/api/rss'
      },
      {
        source: '/google-news.xml',
        destination: '/api/google-news'
      },
      {
        source: '/amp/:path*',
        destination: '/api/amp/:path*'
      }
    ];
  }
};

export default nextConfig;
