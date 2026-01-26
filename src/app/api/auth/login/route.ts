import { NextResponse } from 'next/server';
import { authService } from '@/backend/services/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await authService.login(email, password);

    if (result.success && result.user) {
      const response = NextResponse.json({ user: result.user, message: 'Login successful' });
      
      // Set a secure HTTP-only cookie for the session
      response.cookies.set('auth_token', result.token!, {
        httpOnly: true,
        secure: false, // Changed to false to ensure compatibility with all environments (HTTP/HTTPS)
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
