import api from './axiosConfig';

export interface RegisterPayload {
  sr_code: string;
  full_name: string;
  name: string;       // same as full_name (for backward compat with server)
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = (data: RegisterPayload) =>
  api.post('/api/register', data).then((r) => r.data);

export const login = (data: LoginPayload) =>
  api.post('/api/login', data).then((r) => r.data);
