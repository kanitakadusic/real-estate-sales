window.onload = () => {

    // Funkcija za ažuriranje menija na osnovu statusa prijave
    function updateMenuForLoginStatus(loggedIn) {
        const vijestiLink = document.getElementById('vijestiLink');
        const statistikaLink = document.getElementById('statistikaLink');
        const nekretnineLink = document.getElementById('nekretnineLink');
        const detaljiLink = document.getElementById('detaljiLink');
        const profilLink = document.getElementById('profilLink');
        const mojiUpitiLink = document.getElementById('mojiUpitiLink');
        const prijavaLink = document.getElementById('prijavaLink');
        const odjavaLink = document.getElementById('odjavaLink');
    
        if (loggedIn) {
            vijestiLink.style.display = 'block';
            statistikaLink.style.display = 'block';
            nekretnineLink.style.display = 'block';
            detaljiLink.style.display = 'block';
            profilLink.style.display = 'block';
            mojiUpitiLink.style.display = 'block';
            prijavaLink.style.display = 'none';
            odjavaLink.style.display = 'block';
        } else {
            vijestiLink.style.display = 'block';
            statistikaLink.style.display = 'block';
            nekretnineLink.style.display = 'block';
            detaljiLink.style.display = 'block';
            profilLink.style.display = 'none';
            mojiUpitiLink.style.display = 'none';
            prijavaLink.style.display = 'block';
            odjavaLink.style.display = 'none';
        }
    }
    
    PoziviAjax.getKorisnik((error, data) => {
        const loggedIn = !(error || !data || !data.username);
        updateMenuForLoginStatus(loggedIn);
    });

    const odjavaLink = document.getElementById('odjavaLink');
    odjavaLink.addEventListener('click', () => {
        PoziviAjax.postLogout((error, data) => {
            if (error) {
                window.alert(error);
            } else {
                window.location.href = 'http://localhost:3000/prijava.html';
            }
            updateMenuForLoginStatus(false);
        });
    });
};