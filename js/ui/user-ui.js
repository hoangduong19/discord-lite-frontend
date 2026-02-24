import { getCurrentUserInformation , handleChangeUserAvatar, getUserAvatarUrl} from "../api/user.js";
export async function initUserPanel() {
    const area = document.querySelector(".user-panel");
    area.innerHTML = "";
    let userInfo = await getCurrentUserInformation();
    let avatarUrl = await getUserAvatarUrl();
    console.log(userInfo.avatar);
    const infoItem = document.createElement("div");
    infoItem.className = "user-info";
    infoItem.innerHTML = `
    <img class="user-avatar" src="${avatarUrl}" />
    <div class="user-details">
        <div class="user-header">
           <span class="user-name">${userInfo.displayName}</span>
           <span class="user-status">Online</span>
        </div>
    </div>
    `;

    const userActionsContainer = document.createElement("div");
    userActionsContainer.className = "user-actions-container";

    const userAction = document.createElement("div");
    userAction.className = "user-actions";
    userAction.innerHTML = `
        <button class="action-btn">🎤</button>
        <button class="action-btn">🔊</button>
        <button class="action-btn settings-btn">⚙️</button>
    `;

    const settingsMenu = document.createElement("div");
    settingsMenu.className = "settings-menu";
    settingsMenu.innerHTML = `
        <button class="menu-btn change-avatar-btn">Đổi avatar</button>
        <button class="menu-btn logout-btn">Đăng xuất</button>
    `;

    userActionsContainer.appendChild(userAction);
    userActionsContainer.appendChild(settingsMenu);

    area.appendChild(infoItem);
    area.appendChild(userActionsContainer);

    // Add event listener for settings button
    const settingsBtn = userAction.querySelector(".settings-btn");
    settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle("show");
    });

    // Change avatar button
    const changeAvatarBtn = settingsMenu.querySelector(".change-avatar-btn");
    changeAvatarBtn.addEventListener("click", async () => {
        await handleChangeUserAvatar(infoItem);
        settingsMenu.classList.remove("show");
    });

    // Close menu when clicking logout
    const logoutBtn = settingsMenu.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", () => {
        handleLogout();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!userActionsContainer.contains(e.target)) {
            settingsMenu.classList.remove("show");
        }
    });
}

function handleLogout() {
    // Clear sessionStorage
    sessionStorage.removeItem("accessToken");
    // Redirect to login page
    window.location.href = "./login.html";
}
