// js/controller/message-controller.js
import { renderMessages } from "../ui/message-ui.js";
import { getMessagesForChannel } from "../api/message.js";
import {
  connectSocket,
  subscribeChannel,
  sendMessage
} from "./chat-socket.js";

let messages = [];

export function initMessageController() {
  connectSocket();
  bindSend();
}

export async function openChannel(channelId) {
  messages = await getMessagesForChannel(channelId);
  renderMessages(messages);

  subscribeChannel(channelId, onIncomingMessage);
}

function bindSend() {
  const input = document.querySelector(".message-input");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) {
      const channelId = localStorage.getItem("currentChannelId");
      sendMessage(channelId, input.value.trim());
      input.value = "";
    }
  });
}

function onIncomingMessage(message) {
  messages.push(message);
  renderMessages(messages);
}
