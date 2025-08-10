// Central place for configuring the backend base URL.
// Use Vite env var when present; fall back to localhost during development.
export const API_BASE = import.meta.env?.VITE_API_BASE ?? 'http://localhost:5000';
