import { api } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post('/auth/login', {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });

  return response.data;
};

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/auth/register', {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });

  return response.data;
};