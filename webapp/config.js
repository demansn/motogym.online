const dev = process.env.NODE_ENV !== 'production';
const DEV_URL = 'http://localhost:3000';
const PROD_URL = process.env.NEXT_PUBLIC_API_URL;
export const host = dev ? DEV_URL : PROD_URL;

