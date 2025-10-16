// app/api/logincontext/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "123456") {
    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công!",
      token: "fake-jwt-token-123456",
    });
  }

  return NextResponse.json(
    { success: false, message: "Sai tài khoản hoặc mật khẩu!" },
    { status: 401 }
  );
}

export async function GET() {
  return NextResponse.json({ message: "API LoginContext hoạt động bình thường." });
}
