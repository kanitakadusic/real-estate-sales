document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            PoziviAjax.userLogout((error, status) => {
                if (error) {
                    console.error('Greška prilikom odjavljivanja:', error);
                }
            });
        });
    }
});

function showErrorImage(error, containerElement) {
    let image = 'question-mark';
    let alternative = error;

    switch (error) {
        case 'Bad Request': image = '400'; break;
        case 'Not Found': image = '404'; break;
        case 'Too Many Requests': image = '429'; break;
        case 'Internal Server Error': image = '500'; break;
        default: alternative = 'Question Mark';
    }

    const imageElement = document.createElement('img');
    imageElement.src = `../resources/images/${image}.svg`;
    imageElement.alt = alternative;

    containerElement.className = 'error';
    containerElement.replaceChildren(imageElement);
}