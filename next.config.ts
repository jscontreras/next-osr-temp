import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ['default', 'en', 'en-ca'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: false,
};

export default nextConfig;
