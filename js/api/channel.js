const API_BASE = "http://localhost:8080";

export async function createChannelForServer(serverId, channelName) {
  try {
    const token = sessionStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}/servers/${serverId}/channels/create`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({channelName})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
}

export async function getChannelsForServer(serverId) {
  try {
    const token = sessionStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const serverId = localStorage.getItem("currentServerId");
    const response = await fetch(`${API_BASE}/servers/${serverId}/channels`, {
      method: "GET",
      headers: headers
    });
    return await response.json();
} catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
}