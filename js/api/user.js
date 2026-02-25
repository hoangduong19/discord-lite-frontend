const API_BASE = "http://localhost:8080";
export async function getCurrentUserInformation() {
    try {
    const token = sessionStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}/users/my-information`, {
      method: "GET",
      headers: headers
    });
    return await response.json();
} catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
}

export async function handleChangeUserAvatar(infoItem) {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const token = sessionStorage.getItem("accessToken");

      try {
        // Ask backend for presigned upload URL
        const presignResponse = await fetch(
          `${API_BASE}/api/files/presign-user-avatar`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!presignResponse.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const { uploadUrl, key } = await presignResponse.json();

        // 2️⃣ Upload directly to S3
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
          `${API_BASE}/api/files/confirm-user-avatar`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              key: key
            })
          }
        );

        if (!confirmResponse.ok) {
          throw new Error("Confirm failed");
        }

        // Get fresh GET presigned URL
        const avatarResponse = await fetch(
          `${API_BASE}/api/files/get-user-avatar`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        const avatarUrl = await avatarResponse.text();

        const avatarImg = infoItem.querySelector(".user-avatar");
        const msgAvatars = document.querySelectorAll(".msg-avatar");
        avatarImg.src = avatarUrl;
        msgAvatars.forEach(img => img.src = avatarUrl);

      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
    });

    input.click();
}

export async function getUserAvatarUrl() {
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/api/files/get-user-avatar`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await response.text();
}
