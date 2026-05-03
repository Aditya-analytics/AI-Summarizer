const rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const CONFIG = {
  API_BASE_URL,
  APP_NAME: 'Nova',
  VERSION: '3.0.0-final'
};

export default CONFIG;
