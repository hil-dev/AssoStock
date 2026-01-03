import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Exclure _next et fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Exécuter sur les API
    '/api/(.*)',
  ],
};
