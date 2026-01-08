import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the access token from cookies
  const accessToken = request.cookies.get('access_token')?.value;

  // Define protected routes (dashboard and all its sub-routes)
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  // Define auth routes (login, register, etc.)
  const isAuthRoute = pathname.startsWith('/auth');

  // If user is trying to access a protected route without a token
  if (isProtectedRoute && !accessToken) {
    // Redirect to login page
    const loginUrl = new URL('/auth/login', request.url);
    // Add the original URL as a redirect parameter so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

