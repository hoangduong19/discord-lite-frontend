export function renderMessages(messages) {
  const area = document.querySelector(".message-area");
  area.innerHTML = "";

  messages.forEach(m => {
    const item = document.createElement("div");
    item.className = "message-item";

    item.innerHTML = `
      <img class="msg-avatar" src="" />
      <div class="msg-content">
        <div class="msg-header">
          <span class="msg-author">${m.username}</span>
          <span class="msg-time">${formatTime(m.createdAt)}</span>
        </div>
        <div class="msg-text">${escapeHtml(m.content)}</div>
      </div>
    `;

    area.appendChild(item);
  });

  area.scrollTop = area.scrollHeight;
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
