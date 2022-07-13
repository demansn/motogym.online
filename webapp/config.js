const dev = process.env.NODE_ENV !== 'production';
const DEV_API = 'http://localhost:3000';
const PROD_API = process.env.API || 'https://motogym.online';
export const server = dev ? DEV_API : PROD_API;
