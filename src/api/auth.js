// api/auth.js
import { request } from './client';

export const register = (form) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
