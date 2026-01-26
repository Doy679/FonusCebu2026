import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the user is trying to access an admin route
  if (pathname.startsWith('/admin')) {
    // Check for the auth token
    const token = request.cookies.get('auth_token');

    // If no token exists, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }
  }

  // Optional: If user is already logged in and tries to go to /login, send them to dashboard
  if (pathname === '/login') {
    const token = request.cookies.get('auth_token');
    if (token) {
      const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
