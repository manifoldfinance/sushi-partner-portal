
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const defaultTheme = require('tailwindcss/defaultTheme')
const { screens } = defaultTheme

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "app.sushi.com",
      "res.cloudinary.com",
      "raw.githubusercontent.com",
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: false,
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
  publicRuntimeConfig: {
    breakpoints: screens,
  },
};

module.exports = withPWA(nextConfig);

console.log('next.config.js', JSON.stringify(module.exports, null, 2))