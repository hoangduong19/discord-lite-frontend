import { createServer, getServers } from "../api/server.js";
import { loadAndRenderChannels } from "./channel-ui.js";
export function initServerUI() {
  const addServerBtn = document.querySelector(".add-server-btn");
  addServerBtn?.addEventListener("click", handleAddServer);
}

export async function loadAndRenderServers() {
  const servers = await getServers();
  renderServers(servers);
}

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
    await loadAndRenderServers();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}


async function renderServers(servers) {
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

        div.addEventListener("click", async () => {
            console.log("Click server:", server.id);
            localStorage.setItem("currentServerId", server.id);
            await loadAndRenderChannels();
        });

        container.insertBefore(div, addBtn);
    });
}