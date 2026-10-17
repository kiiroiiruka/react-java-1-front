// api/shares.js
import { request } from './client';

export const createShare = (form) =>
  request('/api/shares', { method: 'POST', body: JSON.stringify(form) });
