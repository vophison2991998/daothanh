"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminProfilePage() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && user) {
      // Nếu user đã login, lấy profile thật từ API (hoặc từ user object)
      // Giả sử API của bạn trả đúng dữ liệu full_name, email, phone, address, career_objective
      setProfile(user);
    }
  }, [user, loading]);

  if (loading) return <p>Đang tải...</p>;
  if (!user) return <p>Chưa đăng nhập</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h1>

      {profile ? (
        <div className="space-y-2">
          <p><strong>Họ và tên:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Điện thoại:</strong> {profile.phone}</p>
          <p><strong>Địa chỉ:</strong> {profile.address}</p>
          <p><strong>Mục tiêu nghề nghiệp:</strong> {profile.career_objective}</p>
        </div>
      ) : (
        <p>Đang tải thông tin hồ sơ...</p>
      )}

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={logout}
      >
        Đăng xuất
      </button>
    </div>
  );
}
