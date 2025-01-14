PoziviAjax.getMojiUpiti((error, queries) => {
    const queriesContainer = document.getElementById('queries-container');

    if (error) {
        console.error('Greška prilikom dohvatanja korisničkih upita sa servera:', error);
        showErrorImage(error, queriesContainer);
        return;
    }

    queries.forEach(query => {
        const { id_nekretnine, tekst_upita } = query;

        const queryElement = document.createElement('div');
        queryElement.classList.add('query-container');

        PoziviAjax.getNekretnina(id_nekretnine, (error, property) => {
            const titleElement = document.createElement('div');

            if (error) {
                console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);

                titleElement.textContent = id_nekretnine;
            } else {
                const linkElement = document.createElement('a');
                linkElement.textContent = property.naziv;
                linkElement.href = `http://localhost:3000/detalji.html?id=${encodeURIComponent(id_nekretnine)}`;
                titleElement.appendChild(linkElement);
            }
            
            queryElement.appendChild(titleElement);

            const textElement = document.createElement('p');
            textElement.textContent = tekst_upita;
            textElement.innerHTML = textElement.textContent.replace(/\n/g, '<br>');
            queryElement.appendChild(textElement);

            queriesContainer.appendChild(queryElement);
        });
    });
});