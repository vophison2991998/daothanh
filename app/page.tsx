"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";
import NotificationCenter from "@/components/NotificationCenter";
import { Settings, LogOut } from "lucide-react";

interface TableItem {
  id: number;
  name: string;
  path: string;
}

export default function HomePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [tables, setTables] = useState([
    { title: "Thông tin cá nhân", color: "bg-gradient-to-br from-blue-50 to-blue-100" },
    { title: "Thống kê", color: "bg-gradient-to-br from-green-50 to-green-100" },
    { title: "Sản phẩm", color: "bg-gradient-to-br from-yellow-50 to-yellow-100" },
  ]);

  const [data, setData] = useState<TableItem[][] | null>(null);

  useEffect(() => {
    if (user) {
      setData([
        [
          {
            id: 1,
            name: "Hồ sơ cá nhân",
            path: user?.id
              ? `/table/personal/admin/${user.id}`
              : `/table/personal/admin`,
          },
          { id: 2, name: "Tạo tài khoản", path: "/table/personal/createuser" },
        ],
        [
          { id: 1, name: "Thống kê nước uống", path: "/table/statistics/item1" },
          { id: 2, name: "Thống kê thực phẩm", path: "/table/statistics/item2" },
        ],
        [{ id: 1, name: "Danh sách sản phẩm", path: "/table/products/item1" }],
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleSetting = (itemPath: string) => {
    if (!itemPath) {
      toast.error("Đường dẫn không hợp lệ!");
      return;
    }
    toast.info("⚙️ Đang mở trang...");
    router.push(itemPath);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Đang tải...</p>;
  if (!user || !data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-10 px-6">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-md border border-green-100">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Xin chào, <span className="text-green-800">{user.username}</span>
            </h1>
            <p className="text-gray-500 text-sm">Chúc bạn một ngày làm việc hiệu quả 🌱</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:scale-105 text-white px-5 py-2.5 rounded-full shadow transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tables.map((table, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${table.color}`}
            >
              <div className="px-6 py-4 bg-white flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-700">{table.title}</h2>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>

              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="border px-4 py-2 text-center">STT</th>
                    <th className="border px-4 py-2">Tên mục</th>
                    <th className="border px-4 py-2 text-center">Cài đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {data[idx] && data[idx].length > 0 ? (
                    data[idx].map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-green-100/70 transition-all duration-200"
                      >
                        <td className="border px-4 py-2 text-center text-gray-700 font-medium">
                          {item.id}
                        </td>
                        <td className="border px-4 py-2 text-gray-800">{item.name}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleSetting(item.path)}
                            className="flex items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 text-white text-xs px-4 py-1.5 rounded-full shadow-sm transition-all duration-300"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Cài đặt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-2 text-gray-500">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} - Bảng điều khiển quản trị 🌿
        </div>
      </div>
    </div>
  );
}
