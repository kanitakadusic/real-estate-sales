document.addEventListener('DOMContentLoaded', () => {
    const odjavaLink = document.getElementById('odjavaLink');

    if (odjavaLink) {
        odjavaLink.addEventListener('click', () => {
            PoziviAjax.postLogout((error, status) => {
                if (error) {
                    console.error('Greška prilikom odjavljivanja:', error);
                } else {
                    window.location.href = 'http://localhost:3000/prijava.html';
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