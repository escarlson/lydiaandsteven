import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const method = request.method;
  
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
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
