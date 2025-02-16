const firstnameElement = document.getElementById('firstname');
const lastnameElement = document.getElementById('lastname');
const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const feedbackElement = document.getElementById('feedback');

ApiService.getLoggedInUser((error, { data: user }) => {
    if (error) {
        console.error(error);

        firstnameElement.placeholder = '?';
        lastnameElement.placeholder = '?';
        usernameElement.placeholder = '?';
    } else {
        firstnameElement.placeholder = user.firstname;
        lastnameElement.placeholder = user.lastname;
        usernameElement.placeholder = user.username;
    }
});

document.getElementById('confirm-button').addEventListener('click', () => {
    const user = {};

    if (firstnameElement.value) user.firstname = firstnameElement.value;
    if (lastnameElement.value) user.lastname = lastnameElement.value;
    if (usernameElement.value) user.username = usernameElement.value;
    if (passwordElement.value) user.password = passwordElement.value;

    ApiService.updateLoggedInUser(user, (error, response) => {
        if (error) {
            console.error(error);

            feedbackElement.textContent = error.message;
            feedbackElement.style.display = 'block';
            feedbackElement.style.color = 'var(--error-light)';
        } else {
            feedbackElement.textContent = response.message;
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