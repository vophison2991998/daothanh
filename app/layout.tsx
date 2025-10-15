// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "Trang thông tin cá nhân",
  description: "Phường Đạo Thạnh",
  icons: {
    icon: "https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg", // favicon nhỏ hiển thị trên tab trình duyệt
  },
  openGraph: {
    title: "Phường Đạo Thạnh",
    description: "Website cá nhân có đăng nhập cơ bản",
    images: ["https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg"], // ảnh hiện khi chia sẻ link
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
