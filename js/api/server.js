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

export async function joinServerByCode(inviteCode) { 
  try {
        const token = sessionStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch (`${API_BASE}/servers/join`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ inviteCode: inviteCode })
        });
        if (!response.ok) {
            throw new Error("Không thể join server này do mã không hợp lệ");
        }
        return response.json();
    }
    catch (error) {
        console.error("Lỗi khi join server:", error);
        throw error;
    }
}

export async function handleChangeServerAvatar() {
   const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const token = sessionStorage.getItem("accessToken");
        const serverId = localStorage.getItem("currentServerId");
      try {
        // Ask backend for presigned upload URL
        const presignResponse = await fetch(
          `${API_BASE}/api/files/presign-server-avatar`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              serverId: serverId
            })
          }
        );

        if (!presignResponse.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const { uploadUrl, key } = await presignResponse.json();

        // Upload directly to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type
          },
          body: file
        });

        if (!uploadResponse.ok) {
          throw new Error("S3 upload failed");
        }

        // Confirm to backend (save key in DB)
        const confirmResponse = await fetch(
          `${API_BASE}/api/files/confirm-server-avatar`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                serverId: serverId,
                key: key
            })
          }
        );

        if (!confirmResponse.ok) {
          throw new Error("Confirm failed");
        }

        // Get fresh GET presigned URL
        const avatarResponse = await fetch(
          `${API_BASE}/api/files/get-server-avatar?serverId=${serverId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          }
        );

        const avatarUrl = await avatarResponse.text();

        const serverDiv = document.querySelector(
        `.server-item[data-id="${serverId}"]`
        );

        if (serverDiv) {
        serverDiv.innerHTML = ""; // remove old content

        const img = document.createElement("img");
        img.src = avatarUrl;
        img.className = "server-img";

        serverDiv.appendChild(img);
}

      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
    });

    input.click();
}

export async function getServerAvatarUrl(serverId) {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/api/files/get-server-avatar?serverId=${serverId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    return await response.text();
}