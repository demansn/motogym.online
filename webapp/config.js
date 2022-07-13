const dev = process.env.NODE_ENV !== 'production';
const DEV_URL = 'http://localhost:3000';
const PROD_URL = 'https://motogym.online';
export const server = dev ? DEV_URL : PROD_URL;
