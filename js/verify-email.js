// OTP Input Navigation
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

// Submit form
document.querySelector('.otp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = Array.from(document.querySelectorAll('.otp-input'))
        .map(input => input.value)
        .join('');

    if (code.length === 6) {
        console.log('OTP Code:', code);
        // Gửi code lên server
        alert('Verifying: ' + code);
    } else {
        alert('Please enter all 6 digits');
    }
});
