let stompClient = null;
let currentSub = null;

export function connectSocket() {
  const token = sessionStorage.getItem("accessToken");

  const socket = new WebSocket("ws://localhost:8080/ws");
  stompClient = Stomp.over(socket);
  stompClient.debug = null;

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    () => console.log("✅ WS connected"),
    err => console.error("❌ WS error", err)
  );
}

export function subscribeChannel(channelId, onMessage) {
  if (!stompClient?.connected) return;

  if (currentSub) currentSub.unsubscribe();

  currentSub = stompClient.subscribe(
    `/topic/channel/${channelId}`,
    msg => onMessage(JSON.parse(msg.body))
  );
}

export function sendMessage(channelId, content) {
  if (!stompClient?.connected) return;

  stompClient.send(
    "/app/chat.send",
    {},
    JSON.stringify({
      type: "CHANNEL",
      targetId: channelId,
      content
    })
  );
}
