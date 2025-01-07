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