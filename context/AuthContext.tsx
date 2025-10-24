"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Khi app load lại, đọc user từ localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("❌ Lỗi khi parse user từ localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Hàm login
const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("http://localhost:5000/admins/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn("⚠️ Đăng nhập thất bại, mã:", res.status);
      return false;
    }

    const data = await res.json();
    const baseUser = data.admin || data;

    const detailRes = await fetch(`http://localhost:5000/admins/${baseUser.admin_id || baseUser.id}`);
    if (!detailRes.ok) {
      console.warn("⚠️ Không thể lấy thông tin chi tiết admin");
      return false;
    }

    const detailData = await detailRes.json();
    const userData = { ...baseUser, ...detailData };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/;`;

    return true;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("❌ Request login timeout");
    } else {
      console.error("❌ Lỗi khi đăng nhập:", error);
    }
    return false;
  }
};


  // ✅ Hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie =
      "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook truy cập AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
