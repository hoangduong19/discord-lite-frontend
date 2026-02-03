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
      const msg = await response.text();
      alert("Login failed: " + msg);
      return;
    }

    // login success
    const data = await response.json();

    // lưu JWT
    localStorage.setItem("accessToken", data.token);

    // chuyển sang trang home
    window.location.href = "../index.html";

  } catch (error) {
    console.error(error);
    alert("Không kết nối được backend");
  }
});
