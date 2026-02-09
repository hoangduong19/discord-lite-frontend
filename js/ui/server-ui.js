import { createServer, getServers, joinServerByCode } from "../api/server.js";
import { loadAndRenderChannels } from "./channel-ui.js";
export function initServerUI() {
  const addServerBtn = document.querySelector(".add-server-btn");
  addServerBtn?.addEventListener("click", handleAddServer);
  const joinServerBtn = document.querySelector(".join-server-btn");
  joinServerBtn?.addEventListener("click", handleJoinServer);
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

async function handleJoinServer() {
  const inviteCode = prompt("Nhập mã mời server:");
  if (!inviteCode || inviteCode.trim() === "") {
    return; // Người dùng bỏ qua
  }

  try {
    const response = await joinServerByCode(inviteCode.trim());
    console.log("Join server thành công:", response);
    alert(`Đã join server "${response.serverName}" thành công!`);
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
    const joinBtn = container.querySelector(".join-server-btn");

    // Xóa server cũ (giữ lại nút +)
    container.querySelectorAll(".server-item:not(.add-server-btn):not(.join-server-btn)")
        .forEach(el => el.remove());
    servers.forEach((server, index) => {
        const div = document.createElement("div");
        div.className = "server-item";
        div.dataset.name = server.serverName; // tooltip OK

        div.addEventListener("click", async () => {
            console.log("Click server:", server.id);
            localStorage.setItem("currentServerId", server.id);
            await loadAndRenderChannels();
        });

        if (index === 0) {
            // Tự động chọn server đầu tiên
            div.click();
        }
        container.insertBefore(div, addBtn);
    });
}