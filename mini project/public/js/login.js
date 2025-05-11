document.addEventListener('DOMContentLoaded', () => {
    const adminTab = document.getElementById('adminTab');
    const visitorTab = document.getElementById('visitorTab');
    const adminForm = document.getElementById('adminForm');
    const visitorForm = document.getElementById('visitorForm');
    const sendOtpBtn = document.getElementById('sendOtpBtn');

    // Tab switching functionality
    adminTab.addEventListener('click', () => {
        adminTab.classList.add('bg-blue-600', 'text-white');
        adminTab.classList.remove('bg-gray-200', 'text-gray-700');
        visitorTab.classList.add('bg-gray-200', 'text-gray-700');
        visitorTab.classList.remove('bg-blue-600', 'text-white');
        adminForm.classList.remove('hidden');
        visitorForm.classList.add('hidden');
    });

    visitorTab.addEventListener('click', () => {
        visitorTab.classList.add('bg-blue-600', 'text-white');
        visitorTab.classList.remove('bg-gray-200', 'text-gray-700');
        adminTab.classList.add('bg-gray-200', 'text-gray-700');
        adminTab.classList.remove('bg-blue-600', 'text-white');
        visitorForm.classList.remove('hidden');
        adminForm.classList.add('hidden');
    });

    // Admin login form submission
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const adminId = document.getElementById('adminId').value;
        const password = document.getElementById('adminPassword').value;

        try {
            console.log('Attempting admin login...');
            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminId, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', 'admin');
                console.log('Login successful, redirecting to index...');
                // Redirect to index page immediately
                window.location.replace('/index.html');
            } else {
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    // Visitor OTP request
    sendOtpBtn.addEventListener('click', async () => {
        const phoneNumber = document.getElementById('phoneNumber').value;
        const aadhaarNumber = document.getElementById('aadhaarNumber').value;

        if (!phoneNumber || !aadhaarNumber) {
            alert('Please enter both phone number and Aadhaar number');
            return;
        }

        try {
            const response = await fetch('/api/auth/visitor/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, aadhaarNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('OTP sent successfully!');
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP request error:', error);
            alert('An error occurred while sending OTP. Please try again.');
        }
    });

    // Visitor login form submission
    visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value;
        const aadhaarNumber = document.getElementById('aadhaarNumber').value;
        const otp = document.getElementById('otp').value;

        try {
            const response = await fetch('/api/auth/visitor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, aadhaarNumber, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', 'visitor');
                // Redirect to visitor dashboard
                window.location.href = '/visitor-dashboard.html';
            } else {
                alert(data.message || 'Login failed. Please check your credentials and OTP.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
}); 