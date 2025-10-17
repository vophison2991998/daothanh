"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!user) return null;

  const tables = [
    { title: "Bảng 1: Thông tin cá nhân", color: "bg-blue-50" },
    { title: "Bảng 2: Danh sách đơn hàng", color: "bg-green-50" },
    { title: "Bảng 3: Sản phẩm", color: "bg-yellow-50" },
    { title: "Bảng 4: Thông báo hệ thống", color: "bg-purple-50" },
    { title: "Bảng 5: Hoạt động gần đây", color: "bg-pink-50" },
    { title: "Bảng 6: Cài đặt tài khoản", color: "bg-gray-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Xin chào, {user} 👋
        </h1>

        {/* Nút đăng xuất */}
        <div className="flex justify-center mb-10">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>

        {/* 6 bảng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tables.map((table, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md overflow-hidden border border-gray-200 ${table.color}`}
            >
              <h2 className="text-lg font-semibold text-center py-3 bg-white border-b">
                {table.title}
              </h2>

              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">#</th>
                    <th className="border px-3 py-2 text-left">Tên</th>
                    <th className="border px-3 py-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{i}</td>
                      <td className="border px-3 py-2">Mục {i}</td>
                      <td className="border px-3 py-2 text-green-600">Hoạt động</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
