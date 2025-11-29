export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/profile/:path*", "/api/favorites/:path*", "/api/views/:path*"],
};
