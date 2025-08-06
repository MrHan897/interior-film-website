/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 에러 무시 (배포용)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 에러 무시 (배포용)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdjlawzmeeqkyvqwwbga.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  async headers() {
    return [
      {
        // 모든 API 라우트에 보안 헤더 적용
        source: '/api/:path*',
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://sdjlawzmeeqkyvqwwbga.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
      {
        // 관리자 페이지에 추가 보안 헤더
        source: '/admin/:path*',
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  
  // 서버 외부 패키지 설정
  serverExternalPackages: ['jose'],
};

module.exports = nextConfig;