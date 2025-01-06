window.onload = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    const loginButton = document.getElementById('login-button');
    
    loginButton.onclick = () => {
        PoziviAjax.postLogin(username.value, password.value, (error, data) => {
            if (error) {
                window.alert(error);
            } else {
                if (JSON.parse(data).poruka == 'Neuspješna prijava') {
                    let divElement = document.getElementById('message');
                    divElement.innerHTML = '<p>Neispravni podaci</p>';
                } else {
                    window.location.href = 'http://localhost:3000/nekretnine.html';
                }
            }
        });
    };
};