"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Kiểm tra trạng thái đăng nhập khi mở app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");
    if (storedUser && expiresAt && Date.now() < Number(expiresAt)) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // ✅ Hàm đăng nhập
  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === "admin" && password === "123456") {
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 ngày
      localStorage.setItem("user", username);
      localStorage.setItem("expiresAt", expiresAt.toString());
      setUser(username);
      return true;
    }
    return false;
  };

  // ✅ Đăng xuất
  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook tiện dùng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
