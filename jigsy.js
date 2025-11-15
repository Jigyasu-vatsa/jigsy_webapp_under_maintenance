// static/js/jigsy.js

// Password Toggle Functionality
document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.querySelector(targetId);
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            this.textContent = '👁️';
        }
    });
});


// Function to set the initial disabled state for all password buttons
function initializePasswordButtons() {
    // Targets registration button
    const registerButton = document.getElementById('register-btn');
    if (registerButton) {
        registerButton.disabled = true;
    }
    
    // Targets Change Password button
    const changeButton = document.getElementById('change-password-btn');
    if (changeButton) {
        changeButton.disabled = true;
    }

    // Targets Set New Password button (on verify_password_otp page)
    const setButton = document.getElementById('set-password-btn'); // Assuming a dedicated ID for the reset button
    if (setButton) {
        setButton.disabled = true;
    }
}

// Global flag to track if the password is STRONG (needed for multiple checks)
let isPasswordStrong = false; // Flag for Registration flow

// Live Password Strength Check for Register page
function checkPasswordStrength() {
    const password = document.getElementById('reg-password').value;
    const feedback = document.getElementById('password-strength-feedback');
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$");

    if (strongRegex.test(password)) {
        feedback.innerHTML = '<span class="text-success">Strong password.</span>';
        isPasswordStrong = true; // Set flag to true
    } else {
        feedback.innerHTML = '<span class="text-danger">Password must be at least 8 characters and include uppercase, lowercase, number, and a special character.</span>';
        isPasswordStrong = false; // Set flag to false
    }
    // Always call match check, which uses the flag to enable/disable the button
    checkPasswordMatch(); 
}

// Live Password Match Check for Register page
function checkPasswordMatch() {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-password2').value;
    const feedback = document.getElementById('password-match-feedback');
    const button = document.getElementById('register-btn');

    const passwordsMatch = (password === confirmPassword && password.length > 0);

    if (passwordsMatch && isPasswordStrong) { // CRITICAL FIX: Require BOTH conditions
        feedback.innerHTML = '<span class="text-success">Passwords match.</span>';
        button.disabled = false;
    } else if (confirmPassword.length > 0 && !passwordsMatch) {
        feedback.innerHTML = '<span class="text-danger">Passwords do not match.</span>';
        button.disabled = true;
    } else {
        feedback.innerHTML = '';
        button.disabled = true; // Disable if either condition fails
    }
}



let isNewPasswordStrong = false; // New flag for change/reset flows

// Live Password Strength Check for Forgot/Change Password pages
function checkNewPasswordStrength() {
    const newPassword = document.getElementById('new-password').value;
    const feedback = document.getElementById('password-strength-feedback');
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$");

    if (strongRegex.test(newPassword)) {
        feedback.innerHTML = '<span class="text-success">Strong password.</span>';
        isNewPasswordStrong = true; // CRITICAL FIX
    } else {
        feedback.innerHTML = '<span class="text-danger">Password must be at least 8 characters and include uppercase, lowercase, number, and a special character.</span>';
        isNewPasswordStrong = false; // CRITICAL FIX
    }
    // Always call match check, which now uses the flag
    checkNewPasswordMatch();
}

// Live Password Match Check for Forgot/Change Password pages
function checkNewPasswordMatch() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const feedback = document.getElementById('new-password-match-feedback');
    // Button could be 'set-password-btn' (reset) or 'change-password-btn'
    const button = document.getElementById('set-password-btn') || document.getElementById('change-password-btn');

    const passwordsMatch = (newPassword === confirmPassword && newPassword.length > 0);

    if (passwordsMatch && isNewPasswordStrong) { // CRITICAL FIX: Require BOTH conditions
        feedback.innerHTML = '<span class="text-success">Passwords match.</span>';
        if (button) button.disabled = false;
    } else if (confirmPassword.length > 0 && !passwordsMatch) {
        feedback.innerHTML = '<span class="text-danger">Passwords do not match.</span>';
        if (button) button.disabled = true;
    } else {
        feedback.innerHTML = '';
        if (button) button.disabled = true;
    }
}

// --- CRITICAL STEP: Call the initialization function immediately ---
document.addEventListener('DOMContentLoaded', initializePasswordButtons);

// Email Uniqueness and Format Check
let emailTimeout;
function checkEmail(email, isRegistration) {
    clearTimeout(emailTimeout);
    emailTimeout = setTimeout(() => {
        const feedback = document.getElementById('email-feedback');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            feedback.innerHTML = '<span class="text-danger">Please enter a valid email address.</span>';
            return;
        }

        if (isRegistration) {
            fetch(`/auth/check-email?email=${encodeURIComponent(email)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        feedback.innerHTML = '<span class="text-danger">Email already registered.</span>';
                    } else {
                        feedback.innerHTML = '<span class="text-success">Email is available.</span>';
                    }
                })
                .catch(() => {
                    feedback.innerHTML = '<span class="text-warning">Could not check email availability.</span>';
                });
        }
    }, 500);
}


 // Floating cursor for move to top 
 
 // Get the button
 let mybutton = document.getElementById("myBtn");
 
 // When the user scrolls down 20px from the top of the document, show the button
 window.onscroll = function() {scrollFunction()};
 
 function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  mybutton.style.display = "block";
  } else {
  mybutton.style.display = "none";
  }
 }
 
 // When the user clicks on the button, scroll to the top of the document
 function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
 }