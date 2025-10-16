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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700">Xin chào, {user} 👋</h1>
      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}
