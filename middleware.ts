import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Routes publiques autorisées
  const publicRoutes = ["/auth/login", "/auth/signup", "/api/auth"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Pour toutes les autres routes, vérifier l'authentification admin
  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  // Vérifier le rôle admin
  const userRole = (req.auth.user as any).role;
  if (userRole !== "admin") {
    return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
