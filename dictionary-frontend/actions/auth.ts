'use server';

import { cookies } from 'next/headers';
import { serverApi } from '../lib/api';

export interface AuthState {
  success: boolean;
  error?: string;
}

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }

    console.log('Tentando login com:', { email, password: '***' });

    const response = await serverApi.post('/auth/signin', {
      email,
      password
    });

    console.log('Resposta do login:', response.data);

    const token = response.data.response?.token || response.data.token;

    if (!token) {
      return { success: false, error: 'Token não recebido do servidor' };
    }

    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error: any) {
    console.error('Erro no login:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Erro ao fazer login';

    return {
      success: false,
      error: errorMessage
    };
  }
}

export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
      return { success: false, error: 'Todos os campos são obrigatórios' };
    }

    console.log('Tentando registro com:', { name, email, password: '***' });

    const response = await serverApi.post('/auth/signup', {
      name,
      email,
      password
    });

    console.log('Resposta do registro:', response.data);

    return { success: true };
  } catch (error: any) {
    console.error('Erro no registro:', error.response?.data || error.message);

    const errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Erro ao registrar usuário';

    return {
      success: false,
      error: errorMessage
    };
  }
}