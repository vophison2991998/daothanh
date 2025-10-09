"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";



export default function LoginPage() {
 const router = useRouter();
  const { login } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const sessionDataKey = "1fca374b-a4bc-46d1-9083-2a2f95154053";
  const relyingParty = "0vFpdFtniMwmiWOUnWfOFYZcNdAa";
  const tenantDomain = "carbon.super";

  useEffect(() => {
    setIsMobile(checkIsMobile());
    checkSessionKey();

    const qs = typeof window !== "undefined" ? window.location.search : "";
    if (qs && qs.includes("IDPBCA")) {
      setTimeout(() => {
        const el = document.getElementById("icon-2");
        el?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, 300);
    }
  }, []);

  async function checkSessionKey() {
    try {
 const url = `/api/logincontext?sessionDataKey=${sessionDataKey}&relyingParty=${relyingParty}&tenantDomain=${tenantDomain}`;
const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) return;
      const data = await res.json();
      if (data && data.status === "redirect" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      // ignore silently
    }
  }

  function checkIsMobile() {
    const agents = ["Android", "webOs", "iPhone", "iPad", "blackberry"];
    const device =
      typeof window !== "undefined" ? localStorage.getItem("DEVICE") : null;
    if (device === "MOBILE") return true;
    for (const a of agents) {
      if (typeof navigator !== "undefined" && navigator.userAgent.match(a))
        return true;
    }
    return false;
  }

  function handleNoDomain(key: string, value: string) {
    const multiOptionURI =
      "%2Fauthenticationendpoint%2Foauth2_login.do%3Fclient_id%3D0vFpdFtniMwmiWOUnWfOFYZcNdAa%26commonAuthCallerPath%3D%252Foauth2%252Fauthorize%26forceAuth%3Dfalse%26passiveAuth%3Dfalse%26redirect_uri%3Dhttps%253A%252F%252Fdichvucong.gov.vn%252Fp%252Fhome%252Fdvc-trang-chu.html%26response_type%3Dcode%26scope%3Dopenid%26tenantDomain%3Dcarbon.super%26sessionDataKey%3D1fca374b-a4bc-46d1-9083-2a2f95154053%26relyingParty%3D0vFpdFtniMwmiWOUnWfOFYZcNdAa%26type%3Doidc%26sp%3DVneIDDoanhNghiep%26isSaaSApp%3Dfalse%26authenticators%3DOpenIDConnectAuthenticator%253AVnconnect%2BDVC%253AIDP%2BBCA%253AVNeID_TC_DN";
    const url = `../commonauth?idp=${encodeURIComponent(
      key
    )}&authenticator=${encodeURIComponent(
      value
    )}&sessionDataKey=${sessionDataKey}&multiOptionURI=${multiOptionURI}`;
    window.location.href = url;
  }

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/logincontext", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Đăng nhập thất bại!");
      return;
    }

    alert(data.message);
    localStorage.setItem("token", data.token);
    router.push("/dashboard"); // ✅ chuyển đúng cách
  } catch (err) {
    setError("Lỗi kết nối máy chủ!");
  }
};
  return (
    <main className="min-h-screen bg-[#FBFBFB] font-sans flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <a
              href="#"
              onClick={(e) => {
                if (!isMobile) {
                  e.preventDefault();
                  window.location.href = "/";
                }
              }}
            >
              <img
                src="https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg"
                alt="logo"
                className="h-14 w-14 mx-auto"
              />
            </a>
            <div className="mt-2">
              <img
                src="https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/GroupTextHeader.svg"
                alt="group text"
                className="mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Main login area */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-4">
            <h4 className="text-gray-800 font-semibold text-lg">Đăng nhập</h4>
            <h5 className="text-primary text-blue-600 mt-2 text-sm">
              Chọn loại tài khoản bạn muốn sử dụng đăng nhập<br />
              Cổng dịch vụ công Quốc Gia
            </h5>
          </div>

          {/* Nút chuyển giữa 2 chế độ */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowForm(false)}
              variant={!showForm ? "default" : "outline"}
              className="mx-2"
            >
              Đăng nhập qua cổng DVC
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              variant={showForm ? "default" : "outline"}
              className="mx-2"
            >
              Tài khoản & mật khẩu
            </Button>
          </div>

          {/* --- Giao diện đăng nhập --- */}
          {!showForm ? (
            <>
              {/* Các lựa chọn đăng nhập qua cổng */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[570px] mx-auto">
                <button
                  id="icon-1"
                  onClick={() =>
                    handleNoDomain("Vnconnect%20DVC", "OpenIDConnectAuthenticator")
                  }
                  className="border border-gray-200 bg-white p-4 h-44 flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-md"
                >
                  <img
                    src="https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/quoc_huy.svg"
                    alt="vnconnect"
                    className="h-16 mb-2"
                  />
                  <div className="text-center text-blue-700 text-xs">
                    Tài khoản cấp bởi Cổng dịch vụ công quốc gia dành cho
                    Doanh nghiệp/Tổ chức
                  </div>
                </button>

                <button
                  id="icon-2"
                  onClick={() =>
                    handleNoDomain("IDP%20BCA", "OpenIDConnectAuthenticator")
                  }
                  className="border border-gray-200 bg-white p-4 h-44 flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-md"
                >
                  <img
                    src="https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/logo_bca.png"
                    alt="bca"
                    className="h-16 mb-2"
                  />
                  <div className="text-center text-blue-700 text-xs">
                    Tài khoản Định danh điện tử cấp bởi Bộ Công an dành cho
                    Công dân
                  </div>
                </button>

                <button
                  id="icon-3"
                  onClick={() =>
                    handleNoDomain("VNeID_TC_DN", "OpenIDConnectAuthenticator")
                  }
                  className="border border-gray-200 bg-white p-4 h-44 flex flex-col items-center justify-center rounded-md shadow-sm hover:shadow-md"
                >
                  <img
                    src="https://xacthuc.dichvucong.gov.vn/authenticationendpoint/images/logo_bca.png"
                    alt="vneid-tn"
                    className="h-16 mb-2"
                  />
                  <div className="text-center text-blue-700 text-xs">
                    Tài khoản Định danh điện tử cấp bởi Bộ Công an dành cho Tổ
                    chức, doanh nghiệp
                  </div>
                </button>
              </div>

              <div className="bg-amber-50 p-5 rounded mt-6 text-sm">
                <em className="uppercase font-semibold">
                  Thông báo từ hệ thống:
                </em>
                <p className="mt-2">
                  Khi đăng nhập các thông tin cá nhân (Họ và tên, ngày sinh,
                  giới tính, số điện thoại,...) được đồng bộ từ VNeID sang Cổng
                  Dịch vụ công Quốc gia để phục vụ giải quyết TTHC
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Form đăng nhập bằng tài khoản */}
           <form onSubmit={handleLogin} className="space-y-4">
  <input
    type="text"
    placeholder="Tên đăng nhập"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="border p-2 w-full"
  />
  <input
    type="password"
    placeholder="Mật khẩu"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border p-2 w-full"
  />
  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
    Đăng nhập
  </button>
</form>
              <p className="text-gray-500 text-center text-sm mt-4">
                (Tài khoản mẫu: <strong>admin</strong> / <strong>123456</strong>)
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        {!isMobile && (
          <footer className="mt-6 bg-[#913938] text-white rounded p-3 text-center">
            <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-6 gap-2">
              <div className="text-sm">Cơ quan chủ quản: Văn phòng Chính phủ</div>
              <div className="text-sm">www.dichvucong.gov.vn</div>
              <div className="text-sm">Tổng đài hỗ trợ: 18001096</div>
              <div className="text-sm">Email: dichvucong@chinhphu.vn</div>
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
