// app/(public)/page.tsx
"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import info from "@/data/info.json";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <section className="flex flex-col items-center text-center space-y-6">
        <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg">
          <Image
            src={info.avatar}
            alt={info.name}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>

        <h1 className="text-4xl font-bold text-blue-600">{info.name}</h1>
        <p className="text-lg text-gray-600">{info.title}</p>
        <a href={`mailto:${info.email}`} className="text-blue-600 underline">
          {info.email}
        </a>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {info.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <a href={info.cv} download>
            <Button variant="primary">📄 Tải CV</Button>
          </a>
          <Button variant="secondary" onClick={logout}>
            🚪 Đăng xuất
          </Button>
        </div>
      </section>
    </ProtectedRoute>
  );
}
