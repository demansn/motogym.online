const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  strictMode: true,
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['https://motogym-files.s3.eu-west-2.amazonaws.com', 'motogym-files.s3.eu-west-2.amazonaws.com']
  },
  distDir: 'build'
};

module.exports = nextConfig;
