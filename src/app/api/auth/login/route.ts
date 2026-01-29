import { NextResponse } from 'next/server';
import { authService } from '@/backend/services/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await authService.login(email, password);

    if (user) {
      const response = NextResponse.json({ user, message: 'Login successful' });
      
      // Set a temporary cookie to indicate the user is logged in
      // Note: Real Firebase sessions are usually handled via the client-side SDK, 
      // but we'll keep the cookie logic for your existing middleware/admin checks.
      response.cookies.set('auth_token', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}