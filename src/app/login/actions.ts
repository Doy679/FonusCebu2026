'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authService } from '@/backend/services/authService';

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const result = await authService.login(email, password);

    if (result.success && result.token) {
      // Set cookie directly on the server
      const cookieStore = await cookies();
      cookieStore.set('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
    } else {
      return { error: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred' };
  }

  // Redirect must happen outside try/catch if successful
  // because it throws a special error to handle the redirect
  redirect('/admin/dashboard');
}
