"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";

interface WorkExperience {
  position: string;
  company: string;
  start_year: string;
  end_year?: string;
  description?: string;
}

interface AdminProfile {
  full_name: string;
  avatar_url?: string;
  position?: string;
  phone?: string;
  gender?: string;
  religion?: string;
  email?: string;
  birth_date?: string;
  address?: string;
  career_objective?: string;
  work_experience?: WorkExperience[];
}

export default function AdminProfilePage() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<AdminProfile>({
    full_name: "",
    avatar_url: "",
    position: "",
    phone: "",
    gender: "",
    religion: "",
    email: "",
    birth_date: "",
    address: "",
    career_objective: "",
    work_experience: [],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        try {
          const res = await fetch(`http://localhost:5000/admins/${user.admin_id || user.id}`);
          if (!res.ok) throw new Error("Không thể tải thông tin admin");
          const data: AdminProfile = await res.json();
          setProfile(data);
          setEditData({ ...data, work_experience: data.work_experience ?? [] });
          setAvatarPreview(data.avatar_url ?? "");
        } catch (err: any) {
          setError(err.message || "Lỗi không xác định");
        }
      })();
    }
  }, [user, loading]);

  // Handle avatar change
  const handleAvatarChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }
    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (avatarFile) formData.append("avatar", avatarFile);
      Object.entries(editData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === "string" ? value : JSON.stringify(value));
        }
      });

      const res = await fetch(`http://localhost:5000/admins/${user.admin_id || user.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Không thể lưu dữ liệu");
      const updated: AdminProfile = await res.json();
      setProfile(updated);
      setEditData({ ...updated, work_experience: updated.work_experience ?? [] });
      setAvatarFile(null);
      setAvatarPreview(updated.avatar_url ?? "");
      setEditMode(false);
      toast.success("Lưu thành công!");
    } catch (err: any) {
      toast.error("Lỗi khi lưu: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  // WorkExperience functions
  const updateWorkExperience = (index: number, key: keyof WorkExperience, value: string) => {
    const newWe = [...(editData.work_experience ?? [])];
    newWe[index] = { ...newWe[index], [key]: value };
    setEditData({ ...editData, work_experience: newWe });
  };

  const addWorkExperience = () =>
    setEditData({
      ...editData,
      work_experience: [
        ...(editData.work_experience ?? []),
        { position: "", company: "", start_year: "", end_year: "", description: "" },
      ],
    });

  const removeWorkExperience = (index: number) => {
    const newWe = [...(editData.work_experience ?? [])];
    newWe.splice(index, 1);
    setEditData({ ...editData, work_experience: newWe });
  };

  if (loading) return <p>⏳ Đang tải...</p>;
  if (!user) return <p>❌ Bạn chưa đăng nhập</p>;
  if (error) return <p className="text-red-500">⚠️ Lỗi: {error}</p>;
  if (!profile) return <p>Đang tải thông tin hồ sơ...</p>;

  const profileFields: { label: string; key: keyof AdminProfile; type?: string }[] = [
    { label: "Chức Vụ", key: "position" },
    { label: "SDT", key: "phone" },
    { label: "Giới Tính", key: "gender" },
    { label: "Tôn Giáo", key: "religion" },
    { label: "Email", key: "email", type: "email" },
    { label: "Ngày Sinh", key: "birth_date", type: "date" },
    { label: "Địa Chỉ", key: "address" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <Toaster />
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cột trái */}
        <div className="bg-[#2f3d3c] text-white p-6 flex flex-col items-center relative">
          <div className="relative">
            <img
              src={avatarPreview || "/avatar-placeholder.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            {editMode && (
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white cursor-pointer rounded-full hover:bg-opacity-60 transition">
                <span className="text-sm">Đổi hình đại diện</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleAvatarChange(e.target.files[0])}
                />
              </label>
            )}
          </div>

          {editMode ? (
            <InputField
              value={editData.full_name}
              onChange={(val) => setEditData({ ...editData, full_name: val })}
              placeholder="Họ và tên"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-center mt-4">{profile.full_name}</h2>
          )}

          <p className="text-green-300 font-medium text-center mt-1">{editMode ? null : profile.position || "Quản trị viên"}</p>

          <div className="mt-6 w-full space-y-3 text-sm">
            {profileFields.map((f) => {
              const value = f.key === "birth_date"
                ? editData.birth_date?.split("T")[0]
                : (editData[f.key] as string | undefined);

              const displayValue = f.key === "birth_date" && profile.birth_date
                ? new Date(profile.birth_date).toLocaleDateString("vi-VN")
                : (profile[f.key] as string | undefined) || "—";

              return (
                <Info
                  key={f.key}
                  icon={f.label}
                  text={editMode ? (
                    <InputField
                      value={value}
                      type={f.type}
                      onChange={(val) => setEditData({ ...editData, [f.key]: val })}
                    />
                  ) : displayValue}
                />
              );
            })}
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-span-2 p-8 space-y-6">
          <Block title="🎯 Mục tiêu nghề nghiệp">
            {editMode ? (
              <textarea
                value={editData.career_objective}
                onChange={(e) => setEditData({ ...editData, career_objective: e.target.value })}
                className="w-full h-32 p-2 border rounded"
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: profile.career_objective || "Chưa cập nhật" }} />
            )}
          </Block>

          <Block title="💼 Kinh nghiệm làm việc">
            {(editData.work_experience ?? []).map((we, i) => (
              <div key={i} className="space-y-1 mb-2 border p-2 rounded">
                {editMode ? (
                  <>
                    <InputField placeholder="Chức vụ" value={we.position} onChange={(val) => updateWorkExperience(i, "position", val)} />
                    <InputField placeholder="Công ty" value={we.company} onChange={(val) => updateWorkExperience(i, "company", val)} />
                    <InputField placeholder="Năm bắt đầu" value={we.start_year} onChange={(val) => updateWorkExperience(i, "start_year", val)} />
                    <InputField placeholder="Năm kết thúc" value={we.end_year} onChange={(val) => updateWorkExperience(i, "end_year", val)} />
                    <textarea placeholder="Mô tả" className="rounded p-1 w-full" value={we.description} onChange={(e) => updateWorkExperience(i, "description", e.target.value)} />
                    <button onClick={() => removeWorkExperience(i)} className="mt-1 text-red-500 text-sm">❌ Xóa</button>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{we.position} — {we.company}</p>
                    <p className="text-sm text-gray-500">{we.start_year} - {we.end_year || "Hiện tại"}</p>
                    <p className="text-sm text-gray-700 mt-1">{we.description}</p>
                  </>
                )}
              </div>
            ))}
            {editMode && (
              <button onClick={addWorkExperience} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                + Thêm kinh nghiệm
              </button>
            )}
          </Block>

          <div className="flex justify-end space-x-2 mt-4">
            {editMode ? (
              <>
                <button disabled={saving} onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData(profile!);
                    setAvatarPreview(profile!.avatar_url ?? "");
                    setAvatarFile(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Chỉnh sửa
              </button>
            )}
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components phụ
function Info({ icon, text }: { icon: string; text: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2 mb-1">
      <span className="font-semibold">{icon}:</span>
      <span className="flex-1">{text}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-[#2f3d3c] border-b-2 border-[#a5b69a] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InputField({ value, onChange, placeholder, type = "text" }: { value?: string; onChange: (val: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded p-1 w-full"
    />
  );
}
