import { createChannelForServer, getChannelsForServer  } from "../api/channel.js";
import { openChannel } from "../websocket/message-controller.js";  
export function initChannelUI() {
    const addChannelBtn = document.querySelector(".add-channel-btn");
    addChannelBtn?.addEventListener("click", handleAddChannel);
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