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

const confirmButton = document.querySelector('#confirm-button');

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

            feedbackElement.textContent = 'Došlo je do greške prilikom ažuriranja podataka.';
            feedbackElement.style.display = 'block';
            feedbackElement.style.color = '#ffc0c7';
        } else {
            console.log(status.poruka);

            feedbackElement.textContent = 'Podaci su uspješno ažurirani.';
            feedbackElement.style.display = 'block';
            feedbackElement.style.color = '#ddffdd';

            if (firstnameElement.value) firstnameElement.placeholder = firstnameElement.value;
            if (lastnameElement.value) lastnameElement.placeholder = lastnameElement.value;
            if (usernameElement.value) usernameElement.placeholder = usernameElement.value;
        }
    });
});