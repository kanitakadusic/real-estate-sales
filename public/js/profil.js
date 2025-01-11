const firstnameElement = document.getElementById('firstname');
const lastnameElement = document.getElementById('lastname');
const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');

PoziviAjax.getKorisnik((error, user) => {
    if (error) {
        console.error('Greška prilikom preuzimanja korisničkih podataka:', error);

        firstnameElement.placeholder = '?';
        lastnameElement.placeholder = '?';
        usernameElement.placeholder = '?';
    } else {
        firstnameElement.placeholder = user.ime;
        lastnameElement.placeholder = user.prezime;
        usernameElement.placeholder = user.username;
    }
});

const confirmButton = document.getElementById('confirm-button');

confirmButton.addEventListener('click', () => {
    const user = {};

    if (firstnameElement.value) user.ime = firstnameElement.value;
    if (lastnameElement.value) user.prezime = lastnameElement.value;
    if (usernameElement.value) user.username = usernameElement.value;
    if (passwordElement.value) user.password = passwordElement.value;

    PoziviAjax.putKorisnik(user, (error, status) => {
        const feedbackElement = document.getElementById('feedback');

        if (error) {
            console.error('Greška prilikom ažuriranja korisničkih podataka:', error);

            feedbackElement.textContent = 'An error occurred while updating data.';
            feedbackElement.style.display = 'block';
            feedbackElement.style.color = 'var(--error-light)';
        } else {
            console.log(status.poruka);

            feedbackElement.textContent = 'The data was successfully updated.';
            feedbackElement.style.display = 'block';
            feedbackElement.style.color = 'var(--success-light)';

            if (firstnameElement.value) {
                firstnameElement.placeholder = firstnameElement.value;
                firstnameElement.value = '';
            }
            
            if (lastnameElement.value) {
                lastnameElement.placeholder = lastnameElement.value;
                lastnameElement.value = '';
            }

            if (usernameElement.value) {
                usernameElement.placeholder = usernameElement.value;
                usernameElement.value = '';
            }

            if (passwordElement.value) {
                passwordElement.value = '';
            }
        }
    });
});