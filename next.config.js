/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Redirect old JS concept URLs to new structure
  async redirects() {
    return [
      {
        source: '/concepts/:conceptId((?!js|dsa)[a-z0-9-]+)',
        destination: '/concepts/js/:conceptId',
        permanent: true,
      },
    ]
  },
  
  // Hot reload configuration
  webpack: (config, { dev, isServer }) => {
    // Enable hot reload for dev mode
    if (dev && !isServer) {
      config.watchOptions = {
        // Use polling as fallback for systems with file watcher limits
        poll: process.env.WEBPACK_POLLING ? parseInt(process.env.WEBPACK_POLLING) : false,
        // Ignore large directories to improve performance
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.next/**'],
        // Aggregate changes to reduce reload frequency
        aggregateTimeout: 300,
      }
    }
    return config
  },
  
  // Ensure Next.js watches all relevant files
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig
