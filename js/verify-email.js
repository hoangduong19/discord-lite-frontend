const API_BASE = "http://localhost:8080";
window.addEventListener("load", async () => {
    const username = localStorage.getItem("pendingUsername");
    const otpSentOnce = localStorage.getItem("otpSentOnce");

    // Không có username → quay về login
    if (!username) {
        window.location.href = "./login.html";
        return;
    }

    // Đã gửi auto rồi → KHÔNG gửi nữa
    if (otpSentOnce === "true") return;

    try {
        await fetch(`${API_BASE}/auth/send-verification-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                purpose: "EMAIL_VERIFY"
            })
        });

        // Đánh dấu đã gửi 1 lần
        localStorage.setItem("otpSentOnce", "true");
        console.log("OTP auto sent");
    } catch (err) {
        console.error("Failed to auto send OTP", err);
    }
});
document.querySelector(".resend-link").addEventListener("click", async (e) => {
    e.preventDefault();

    const username = localStorage.getItem("pendingUsername");
    if (!username) return;

    try {
        await fetch(`${API_BASE}/auth/send-verification-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                purpose: "EMAIL_VERIFY"
            })
        });

        alert("OTP đã được gửi lại");
    } catch (err) {
        alert("Không thể gửi OTP");
    }
});

document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => {
        // Chỉ cho phép nhập số
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        // Tự động chuyển sang ô tiếp theo
        if (e.target.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    // Xử lý Backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputs[index - 1].focus();
        }
        
        if (e.key === 'ArrowRight' && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    }); 

    // Xử lý Paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/[^0-9]/g, '').split('');

        digits.forEach((digit, i) => {
            if (index + i < inputs.length) {
                inputs[index + i].value = digit;
            }
        });

        // Focus vào ô cuối cùng được điền
        if (digits.length > 0) {
            const focusIndex = Math.min(index + digits.length - 1, inputs.length - 1);
            inputs[focusIndex].focus();
        }
    });

    
});

document.querySelector('.otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = Array.from(document.querySelectorAll('.otp-input'))
        .map(input => input.value)
        .join('');

    if (code.length !== 6) {
        alert('Please enter all 6 digits');
        return;
    }

    const username  = localStorage.getItem("pendingUsername");
    if (!username) {
        window.location.href = "./login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                code
            })
        });

        if (!response.ok) {
            alert("Invalid or expired code");
            return;
        }

        alert("Xác thực thành công, vui lòng đăng nhập lại");

        localStorage.removeItem("pendingUsername");
        localStorage.removeItem("otpSentOnce");
        window.location.href = "./login.html";

    } catch (err) {
        console.error(err);
        alert("Cannot connect to server");
    }
});
