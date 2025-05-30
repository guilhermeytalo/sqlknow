const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5171';

if(!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.');
}


export const env = {
    API_BASE_URL,
};