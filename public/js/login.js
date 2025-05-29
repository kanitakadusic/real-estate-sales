const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const feedbackElement = document.getElementById('feedback');

document.getElementById('login-button').addEventListener('click', () => {
    if (usernameElement.value && passwordElement.value) {
        ApiService.userLogin(usernameElement.value, passwordElement.value, (error, response) => {
            if (error) {
                console.error(error);
    
                feedbackElement.textContent = error.message;
                feedbackElement.style.color = 'var(--error-light)';
                feedbackElement.style.display = 'block';
            } else {
                window.location.href = '/properties.html';
            }
        });
    }
});