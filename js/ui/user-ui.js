import { getCurrentUserInformation } from "../api/user.js";
export async function initUserPanel() {
    const area = document.querySelector(".user-panel");
    area.innerHTML = "";
    const userInfo = await getCurrentUserInformation();

    const infoItem = document.createElement("div");
    infoItem.className = "user-info";
    infoItem.innerHTML = `
    <img class="user-avatar" src="${userInfo.avatar}" />
    <div class="user-details">
        <div class="user-header">
           <span class="user-name">${userInfo.displayName}</span>
           <span class="user-status">Online</span>
        </div>
    </div>
    `;

    const userAction = document.createElement("div");
    userAction.className = "user-actions";
    userAction.innerHTML = `
        <button class="action-btn">🎤</button>
        <button class="action-btn">🔊</button>
        <button class="action-btn">⚙️</button>
    `;
    area.appendChild(infoItem);
    area.appendChild(userAction);
}