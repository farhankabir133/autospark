/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  // Set outputFileTracingRoot to this package so Next doesn't try to infer the workspace root
  output: {
    outputFileTracingRoot: path.join(__dirname),
  },
}

module.exports = nextConfig
