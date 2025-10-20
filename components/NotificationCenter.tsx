"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);

  // Hiển thị thông báo mới
  const addNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Xuất hàm ra global window để các file khác dùng được
  if (typeof window !== "undefined") (window as any).notify = addNotification;

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg min-w-[260px] text-white ${
              n.type === "success"
                ? "bg-green-500"
                : n.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            <span>{n.message}</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
