import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest)
{
    const token = await getToken({ req });

    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    // Si user non connecté → redirection vers /login
    if (!isAuth && !isAuthPage)
    {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Si user connecté et essaie d'aller sur /login → redirection vers dashboard
    if (isAuth && isAuthPage)
    {
        if(token.role === "admin")
        {
          return NextResponse.redirect(new URL("/admin_home", req.url));
        }
        else
        {
          return NextResponse.redirect(new URL("/tech_home", req.url));
        }
    }

    return NextResponse.next();
}

export const config =
{
  matcher: [
    // appliquer à tout sauf fichiers internes et NextAuth
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};