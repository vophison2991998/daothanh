import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginUrl = "http://localhost:3000/login";

  // ⚙️ Cho phép vào /login và các file tĩnh
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 🔒 Kiểm tra cookie user
  const userCookie = req.cookies.get("user");

  if (!userCookie) {
    // Chưa đăng nhập → ép chuyển hướng về login
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Đã đăng nhập → cho phép vào trang
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
