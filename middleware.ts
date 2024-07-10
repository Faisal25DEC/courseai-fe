import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes excluding /video and its dynamic sub-routes
const isProtectedRoute = createRouteMatcher([
  "/",
  "/courses/create",
  "/courses/(.*)",
  "/courses",
  "/courses/preview",
  "/analytics",
  "/settings",
  // Add other protected routes here
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  // Ensure /video and its sub-routes are excluded using non-capturing groups
  matcher: [
    "/((?!_next/|.*\\..*|video(?:$|/.*)).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};
