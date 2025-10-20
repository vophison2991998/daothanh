"use client";
import Link from "next/link";

export default function PersonalPage() {
  return (
    <div className="p-8">
    <h1 className="text-xl font-bold mb-4 text-blue-600">3</h1>
      <p>Trang này hiển thị chi tiết hồ sơ cá nhân của người dùng.</p>

      <Link
        href="/"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        ← Quay lại Trang chủ
      </Link>
    </div>
  );
}
