document.getElementById('login-button').addEventListener('click', () => {
    const loginContainer = document.getElementById('login-container');

    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');

    PoziviAjax.postLogin(usernameElement.value, passwordElement.value, (error, status) => {
        if (error) {
            console.error('Greška prilikom prijave korisnika:', error);
            showErrorImage(error, loginContainer);
        } else {
            if (status.poruka === 'Neuspješna prijava') {
                const feedbackElement = document.getElementById('feedback');
                feedbackElement.textContent = 'Invalid data.';
                feedbackElement.style.display = 'block';
            } else {
                window.location.href = 'http://localhost:3000/nekretnine.html';
            }
        }
    });
});