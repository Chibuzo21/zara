import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();
  const { pathname } = request.nextUrl;

  // Unauthenticated — send to login
  if (!isPublicRoute(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/login");
  }

  // Authenticated on login page — send to login form's destination
  // Let the login form handle role-based routing, just get them off /login
  if (pathname === "/login" && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard/owner");
  }

  // Authenticated on root — same, middleware can't know role so just bounce
  if (pathname === "/" && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard/owner");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
