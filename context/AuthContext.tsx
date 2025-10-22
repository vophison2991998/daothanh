"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  // 🔹 Khi F5, nếu đã đăng nhập thì lấy user từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 🔹 Hàm đăng nhập
const login = async (username: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/admins/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Đăng nhập thất bại");
    const data = await res.json();

    // ✅ Chỉ lưu thông tin user, không render object ra giao diện
    setUser(data.admin || data);

    return true;
  } catch (err) {
    alert("Sai tài khoản hoặc mật khẩu");
    return false;
  }
};


  // 🔹 Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
