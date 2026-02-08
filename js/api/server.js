const API_BASE = "http://localhost:8080";

// Gọi API tạo server
export async function createServer(serverName) {
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    
    // Chỉ thêm token nếu nó tồn tại
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/servers/create`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        serverName: serverName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo server");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo server:", error);
    throw error;
  }
}

export async function getServers() {
    try {
        const token = sessionStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch (`${API_BASE}/servers/my-servers`, {
            method: "GET",
            headers: headers
        });
        if (!response.ok) {
            throw new Error("Không thể load server");
        }
        return response.json();
    }
    catch (error) {
        console.error("Lỗi khi load server:", error);
        throw error;
    }
}

