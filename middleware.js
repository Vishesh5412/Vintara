// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // ✅ Edge-compatible JWT verification

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const rawCookie = request.headers.get("cookie");
  if (!rawCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Manually parse cookies (cookie package is not needed in Edge)
  const cookies = Object.fromEntries(
    rawCookie.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    })
  );

  const authToken = cookies.authToken;

  try {
    if (!authToken) {
      console.log("you are makign use fool");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    let secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret){
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { payload } = await jwtVerify(authToken, secret);
    if (!payload || !payload.userid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin")) {
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL("/404", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    console.error("JWT verification failed:", err.message);
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Force expiration
    });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
