import { createChannelForServer, getChannelsForServer  } from "../api/channel.js";
import { openChannel } from "../websocket/message-controller.js";  
export function initChannelUI() {
    const addChannelBtn = document.querySelector(".add-channel-btn");
    addChannelBtn?.addEventListener("click", handleAddChannel);
    initServerSettings();
}
export async function loadAndRenderChannels() {
    const serverId = localStorage.getItem("currentServerId");
    const channels = await getChannelsForServer(serverId);
    renderChannels(channels);
}
async function handleAddChannel()  {
    const channelName = prompt("Nhập tên channel mới:");
    const serverId = localStorage.getItem("currentServerId");
    if (!channelName || channelName.trim() === "") {
        return; // Người dùng bỏ qua
      }
    
      try {
        const response = await createChannelForServer(serverId,channelName.trim());
        
        console.log("Channel tạo thành công:", response.channelName);
        alert(`Channel "${response.channelName}" đã được tạo thành công!`);
        
        // Refresh trang hoặc cập nhật UI
        await loadAndRenderChannels();
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
}
function renderChannels(channels) {
    const channelList = document.querySelector(".channel-list");
    if (!channelList) return;

    // Xóa channel cũ
    channelList.innerHTML = "";
    const channelHeader = document.getElementById("channel-header");

    channels.forEach((channel, index) => {
        const div = document.createElement("div");
        div.className = "channel-item";

        div.innerHTML = `
            <span class="channel-hash">#</span>
            <span class="channel-name">${channel.channelName}</span>
        `;

        div.addEventListener("click", () => {
            channelHeader.innerText = channel.channelName;
            localStorage.setItem("currentChannelId", channel.channelId);

            // Highlight channel đang chọn
            document
                .querySelectorAll(".channel-item")
                .forEach(el => el.classList.remove("active"));

            div.classList.add("active");
            window.openChannel(channel.channelId);
        });

        // Auto active channel đầu tiên
        if (index === 0) {
            div.classList.add("active");
            localStorage.setItem("currentChannelId", channel.channelId);
            channelHeader.innerText = channel.channelName;
            window.openChannel(channel.channelId);
        }

        channelList.appendChild(div);
    });
   
}

function initServerSettings() {
    const settingsIcon = document.querySelector(".settings-icon");
    if (!settingsIcon) return;

    const serverSettings = document.querySelector(".server-settings");
    if (!serverSettings) return;

    // Create settings menu
    const settingsMenu = document.createElement("div");
    settingsMenu.className = "server-settings-menu";
    settingsMenu.innerHTML = `
        <button class="menu-btn change-server-avatar-btn">Đổi avatar server</button>
    `;

    serverSettings.appendChild(settingsMenu);

    // Add event listener for settings icon
    settingsIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle("show");
    });

    // Change server avatar button
    const changeAvatarBtn = settingsMenu.querySelector(".change-server-avatar-btn");
    changeAvatarBtn.addEventListener("click", () => {
        handleChangeServerAvatar();
        settingsMenu.classList.remove("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!serverSettings.contains(e.target)) {
            settingsMenu.classList.remove("show");
        }
    });
}

function handleChangeServerAvatar() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Display preview
        const reader = new FileReader();
        reader.onload = (event) => {
            // In a real app, you would upload this to the server
            // For now, just show alert for confirmation
            alert("Avatar server sẽ được cập nhật (cần kết nối với backend)");
        };
        reader.readAsDataURL(file);
    });
    input.click();
}