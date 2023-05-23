export const LocalesList = ['en', 'ua', 'ru', 'ja'];
export const API_URI = import.meta.env.VITE_PUBLIC_API_URL;

console.log('API_URI', API_URI);
export const GRAPHQL_API = `${API_URI}graphql`;
export const AUTH_API = `${API_URI}auth`;
