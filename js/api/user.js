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