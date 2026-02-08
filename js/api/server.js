const API_BASE = "http://localhost:8080";
console.log("server-ui.js loaded");

// Gọi API tạo server
async function createServer(serverName) {
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    
    // Chỉ thêm token nếu nó tồn tại
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/servers/create`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        serverName: serverName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo server");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo server:", error);
    throw error;
  }
}

async function getServers() {
    try {
        const token = localStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch (`${API_BASE}/servers/my-servers`, {
            method: "GET",
            headers: headers
        });
        if (!response.ok) {
            throw new Error("Không thể load server");
        }
        return response.json();
    }
    catch (error) {
        console.error("Lỗi khi load server:", error);
        throw error;
    }
}

function renderServers(servers) {
    if (!Array.isArray(servers)) {
        console.error("servers is not array", servers);
        return;
    }

    const container = document.querySelector(".server-icon");
    const addBtn = container.querySelector(".add-server-btn");

    // Xóa server cũ (giữ lại nút +)
    container.querySelectorAll(".server-item:not(.add-server-btn)")
        .forEach(el => el.remove());

    servers.forEach(server => {
        const div = document.createElement("div");
        div.className = "server-item";
        div.dataset.name = server.serverName; // tooltip OK

        div.addEventListener("click", () => {
            console.log("Click server:", server.serverId);
            localStorage.setItem("currentServerId", server.serverId);
        });

        container.insertBefore(div, addBtn);
    });
}


// Gắn sự kiện cho nút "+"
const addServerBtn = document.querySelector(".add-server-btn");
addServerBtn?.addEventListener("click", handleAddServer);

// Load server list ngay khi file được load
(async () => {
  try {
    const servers = await getServers();
    renderServers(servers);
  } catch (e) {
    alert("Không load được server");
  }
})();

async function handleAddServer() {
  // Hiển thị dialog để nhập tên server
  const serverName = prompt("Nhập tên server mới:");
  
  if (!serverName || serverName.trim() === "") {
    return; // Người dùng bỏ qua
  }

  try {
    const response = await createServer(serverName.trim());
    
    console.log("Server tạo thành công:", response);
    alert(`Server "${response.serverName}" đã được tạo thành công!`);
    
    // Refresh trang hoặc cập nhật UI
    location.reload();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}
