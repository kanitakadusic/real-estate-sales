document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            ApiService.userLogout((error, response) => {
                if (error) {
                    console.error(error);
                    window.alert(error.message);
                }
            });
        });
    }
});

function showErrorImage(error, containerElement) {
    let image = 'question-mark';
    let alternative = '?';

    if (error) {
        image = error.statusCode;
        alternative = error.statusText;
    }
    
    const imageElement = document.createElement('img');
    imageElement.src = `../resources/images/${image}.svg`;
    imageElement.alt = alternative;

    containerElement.className = 'error';
    containerElement.replaceChildren(imageElement);
}