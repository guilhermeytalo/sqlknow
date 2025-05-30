'use server';

import { cookies } from 'next/headers';
import { serverApi } from '@/infra/http/api';

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


    const response = await serverApi.post('/auth/signin', {
      email,
      password
    });


    const token = response.data.response?.token || response.data.token;

    if (!token) {
      return { success: false, error: 'Token não recebido do servidor' };
    }

    (await cookies()).set({
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

//TODO: Implementar tela + logout
export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
      return { success: false, error: 'Todos os campos são obrigatórios' };
    }

    const response = await serverApi.post('/auth/signup', {
      name,
      email,
      password
    });

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