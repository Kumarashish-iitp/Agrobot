
function toggleForm(formType) {
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');

    if (formType === 'signup') {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
    }
}


document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const sensorId = document.getElementById('sensorId').value;
    
    localStorage.setItem('agrobot_user', username);
    localStorage.setItem('agrobot_sensor_id', sensorId);
    
    window.location.href = 'index.html';
});


document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const sensorId = document.getElementById('new-sensorId').value;
    
    
    localStorage.setItem('agrobot_user', username);
    localStorage.setItem('agrobot_sensor_id', sensorId);
    
    alert("Account created successfully! Redirecting to Dashboard...");
    window.location.href = 'index.html';
});