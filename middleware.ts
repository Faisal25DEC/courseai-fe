import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/courses/create",
  "/courses/(.*)",
  "/courses",
  "/courses/preview",
  "/analytics",
  "/settings",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/|.*\\..*|video(?:$|/.*)).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};
