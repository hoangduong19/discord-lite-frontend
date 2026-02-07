const API_BASE = "http://localhost:8080";

// lấy form
const form = document.getElementById("loginForm");

// lắng nghe submit
form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  // lấy dữ liệu từ input
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // gọi backend
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    // nếu login fail
    if (!response.ok) {
      const err = await response.json();

      switch (err.code) {
        case "EMAIL_NOT_VERIFIED":
          localStorage.setItem("pendingUsername", username);
          localStorage.setItem("otpSentOnce", "false");
          window.location.href = "verify-email.html";
          return;

        case "INVALID_USERNAME":
        case "INVALID_PASSWORD":
          alert("Sai tài khoản hoặc mật khẩu");
          return;

        case "USER_DISABLED":
          alert("Tài khoản đã bị khóa");
          return;

        default:
          alert("Có lỗi xảy ra, thử lại sau");
          return;
      }
    }

    // login success
    const data = await response.json();
    // lưu JWT
    localStorage.setItem("accessToken", data.token);

    // chuyển sang trang home
    window.location.href = "./index.html";

  } catch (error) {
    console.error(error);
    alert("Không kết nối được backend");
  }
});
