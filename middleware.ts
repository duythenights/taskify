import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isProtectedRoute = createRouteMatcher([
  '/organization(.*)',
  '/testing(.*)',
  '/select-org',
  '/board(.*)',
  '/api/cards(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {

    // Add custom logic to run before redirecting

    return auth().redirectToSignIn({returnBackUrl: req.url});
  }

  if(auth().userId && !isProtectedRoute(req)){
    let path = "/select-org";

    if(auth().orgId){ 
      path = `/organization/${auth().orgId}`;
    }

    const orgSelections = new URL(path, req.url);

    return NextResponse.redirect(orgSelections)
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};