import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Giả lập kiểm tra thông tin đăng nhập
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

// Nếu có request GET để test
export async function GET() {
  return NextResponse.json({ message: "API LoginContext hoạt động bình thường." });
}
