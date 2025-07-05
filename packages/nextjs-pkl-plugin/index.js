const path = require('path');

/**
 * Next.js plugin for PKL integration
 * Adds webpack loader and configures hot reload
 */
function withPkl(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack: (config, options) => {
      // Add PKL loader
      config.module.rules.push({
        test: /\.pkl$/,
        use: [
          {
            loader: '@nexo-labs/pkl-webpack-loader',
            options: {
              generateTypes: true,
              generateJson: true,
            }
          }
        ]
      });

      // Ensure PKL files are watched for changes
      if (options.dev) {
        config.watchOptions = {
          ...config.watchOptions,
          ignored: /node_modules\/(?!.*\.pkl$)/,
        };
      }

      // Handle server-side PKL resolution
      if (options.isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: 'empty',
          child_process: 'empty',
        };
      }

      // Handle native modules that shouldn't be bundled
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          // Exclude native node modules
          fsevents: 'fsevents',
          chokidar: 'chokidar',
          'node-gyp': 'node-gyp',
        });
      }

      // Call the user's webpack config if it exists
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },

    // Add PKL files to the list of page extensions for automatic discovery
    pageExtensions: [...(nextConfig.pageExtensions || ['tsx', 'ts', 'jsx', 'js']), 'pkl'],
  };
}

module.exports = withPkl;