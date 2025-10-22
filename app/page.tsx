  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { useAuth } from "@/context/AuthContext";
  import { Toaster, toast } from "sonner";
import NotificationCenter from "@/components/NotificationCenter";

  export default function HomePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const [tables, setTables] = useState([
      { title: "Thông tin cá nhân", color: "bg-blue-50", path: "/table/personal" },
      { title: "Thống kê", color: "bg-green-50", path: "/table/statistics" },
      { title: "Sản phẩm", color: "bg-yellow-50", path: "/table/products" },
    ]);

    const [data, setData] = useState([
      [
        { id: 1, name: "Hồ sơ cá nhân", path: "/table/personal/admin" },
        { id: 2, name: "Tạo tài khoản", path: "/table/personal/createuser" },
      ],
      [
        { id: 1, name: "Thống kê nước uống", path: "/table/statistics/item1" },
        { id: 2, name: "Thống kê thực phẩm", path: "/table/statistics/item2" },
      ],
      [{ id: 1, name: "Danh sách sản phẩm", path: "/table/products/item1" }],
    ]);

    const handleAddTable = () => {
      const newTitle = prompt("Nhập tên bảng mới:");
      if (!newTitle) return;

      const pathName = "/table/" + newTitle.toLowerCase().replace(/\s+/g, "-");
      setTables((prev) => [...prev, { title: newTitle, color: "bg-gray-50", path: pathName }]);
      setData((prev) => [...prev, []]);
      toast.success(`✅ Bảng "${newTitle}" đã được tạo thành công!`);
    };

    const handleAddItem = (tableIndex: number) => {
      setData((prev) => {
        const updated = [...prev];
        const nextId =
          updated[tableIndex].length > 0
            ? Math.max(...updated[tableIndex].map((i) => i.id)) + 1
            : 1;
        updated[tableIndex].push({
          id: nextId,
          name: `Mục ${nextId}`,
          path: tables[tableIndex].path,
        });
        return updated;
      });
      toast.success("✅ Đã thêm mục mới!");
    };

    const handleUpdate = (tableIndex: number, itemId: number) => {
      const newName = prompt("Nhập tên mới:");
      if (!newName) return;
      setData((prev) => {
        const updated = [...prev];
        updated[tableIndex] = updated[tableIndex].map((item) =>
          item.id === itemId ? { ...item, name: newName } : item
        );
        return updated;
      });
      toast.info("✏️ Cập nhật tên mục thành công!");
    };

    const handleDelete = (tableIndex: number, itemId: number) => {
      setData((prev) => {
        const updated = [...prev];
        updated[tableIndex] = updated[tableIndex].filter((item) => item.id !== itemId);
        return updated;
      });
      toast.error("🗑️ Mục đã bị xóa!");
    };

    const handleRemoveDuplicates = (tableIndex: number) => {
      setData((prev) => {
        const updated = [...prev];
        const seen = new Set<string>();
        updated[tableIndex] = updated[tableIndex].filter((item) => {
          const key = item.name.trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return updated;
      });
      toast.success("✨ Đã xóa các mục trùng lặp!");
    };

    useEffect(() => {
      if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Đang tải...</p>;
    if (!user) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-6">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
            <p>{user?.username}</p>

          </h1>

          <div className="flex justify-between items-center mb-10">
            <button
              onClick={handleAddTable}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              + Tạo bảng mới
            </button>
            <NotificationCenter />
            <button
              onClick={logout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tables.map((table, tableIndex) => (
              <div
                key={tableIndex}
                className={`rounded-2xl shadow-md border border-gray-200 overflow-hidden ${table.color}`}
              >
                <div className="flex justify-between items-center px-5 py-3 bg-white border-b">
                  <h2 className="text-lg font-semibold text-gray-700">{table.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddItem(tableIndex)}
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      + Mục
                    </button>
                    <button
                      onClick={() => handleRemoveDuplicates(tableIndex)}
                      className="bg-purple-500 text-white text-sm px-3 py-1 rounded-md hover:bg-purple-600"
                    >
                      🧹 Dọn trùng
                    </button>
                  </div>
                </div>

                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="border px-3 py-2">STT</th>
                      <th className="border px-3 py-2">Tên mục</th>
                      <th className="border px-3 py-2 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[tableIndex]?.map((item) => (
                      <tr key={item.id} className="hover:bg-green-100 transition">
                        <td className="border px-3 py-2">{item.id}</td>
                        <td className="border px-3 py-2">{item.name}</td>
                        <td className="border px-3 py-2 text-center space-x-2">
                          <button
                            onClick={() => router.push(item.path || table.path)}
                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => handleUpdate(tableIndex, item.id)}
                            className="bg-yellow-500 text-white text-xs px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(tableIndex, item.id)}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </td>
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
