const API_BASE = "http://localhost:8080";
export async function getMessagesForChannel(channelId) {
    const headers = {
        "Content-Type": "application/json",
    };
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}/channels/${channelId}/messages`, {
        method: "GET",
        headers: headers,
    });
    if (!response.ok) {
    throw new Error("Load messages failed: " + response.status);
    }

    return response.json();
}