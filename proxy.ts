import { NextRequest, NextResponse } from "next/server";

// List of protected routes
const protectedRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl;
  const method = request.method;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  console.log(`[Proxy] ${pathname} - sessionToken: ${!!sessionToken}`);

  if (!sessionToken) {
    // Redirect to sign-in page and prevent caching of the redirect response
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const redirectResponse = NextResponse.redirect(signInUrl);
    redirectResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    redirectResponse.headers.set("Pragma", "no-cache");
    redirectResponse.headers.set("Expires", "0");
    return redirectResponse;
  }

  // Log Server Action requests (they use POST to special endpoints)
  if (method === 'POST') {
    const isServerAction = 
      request.headers.get('next-action') !== null ||
      url.pathname.includes('/_next/data/');
    
    if (isServerAction) {
      const actionId = request.headers.get('next-action');
      const timestamp = new Date().toISOString();
      
      console.log(`[${timestamp}] Server Action Request:`, {
        method,
        pathname: url.pathname,
        actionId,
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')?.substring(0, 50),
      });
    }
  }

  // For authenticated protected routes, disable caching to avoid showing stale pages after sign-out
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
