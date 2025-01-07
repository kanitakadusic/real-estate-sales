window.onload = () => {
    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');
    
    const loginButton = document.getElementById('login-button');
    
    loginButton.onclick = () => {
        PoziviAjax.postLogin(usernameElement.value, passwordElement.value, (error, status) => {
            if (error) {
                console.error('Greška prilikom prijave korisnika:', error);
            } else {
                if (status.poruka === 'Neuspješna prijava') {
                    let feedbackElement = document.getElementById('feedback');

                    feedbackElement.textContent = 'Neispravni podaci.';
                    feedbackElement.style.display = 'block';
                } else {
                    window.location.href = 'http://localhost:3000/nekretnine.html';
                }
            }
        });
    };
};