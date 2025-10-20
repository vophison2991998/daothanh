import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers"; // ✅ import file client riêng
import { AuthProvider } from "@/context/AuthContext";
import NotificationCenter from "@/components/NotificationCenter";

export const metadata: Metadata = {
  title: "Trang thông tin cá nhân",
  description: "Phường Đạo Thạnh",
  icons: {
    icon: "https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg",
  },
  openGraph: {
    title: "Phường Đạo Thạnh",
    description: "Website cá nhân có đăng nhập cơ bản",
    images: [
      "https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg",
    ],
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
        {/* ✅ Đặt tất cả provider vào đây */}
        
          <Providers>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
        
       
      </body>
    </html>
  );
}
