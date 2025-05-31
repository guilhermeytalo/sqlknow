import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith('/_next/') ||
        request.nextUrl.pathname.startsWith('/api/') ||
        request.nextUrl.pathname.startsWith('/favicon.ico') ||
        request.nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    const isAuthRoute = ['/login', '/register'].some(path => 
        request.nextUrl.pathname.startsWith(path)
    );

    if (token) {
        try {
            await jwtVerify(token, SECRET);
        } catch (error) {
            console.error(error);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    if (!token && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dictionary', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - files with extensions (like .css, .js, .png, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};