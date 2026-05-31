/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      'prisma',
      'bcryptjs',
      'jsonwebtoken',
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    // Hindari bundling modul Node.js native
    config.externals = [...(config.externals || []), 'bcryptjs', 'jsonwebtoken']
    return config
  },
}

module.exports = nextConfig
