PoziviAjax.getMojiUpiti((error, queries) => {
    const queriesContainer = document.getElementById('queries-container');

    if (error) {
        console.error('Greška prilikom dohvatanja korisničkih upita sa servera:', error);
        showErrorImage(error, queriesContainer);
        return;
    }

    queries.forEach(query => {
        const { nekretnina_id, tekst } = query;

        const queryElement = document.createElement('div');
        queryElement.classList.add('query-container');

        PoziviAjax.getNekretnina(nekretnina_id, (error, property) => {
            const titleElement = document.createElement('div');

            if (error) {
                console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);

                titleElement.textContent = nekretnina_id;
            } else {
                const linkElement = document.createElement('a');
                linkElement.textContent = property.naziv;
                linkElement.href = `http://localhost:3000/detalji.html?id=${encodeURIComponent(nekretnina_id)}`;
                titleElement.appendChild(linkElement);
            }
            
            queryElement.appendChild(titleElement);

            const textElement = document.createElement('p');
            textElement.textContent = tekst;
            textElement.innerHTML = textElement.textContent.replace(/\n/g, '<br>');
            queryElement.appendChild(textElement);

            queriesContainer.appendChild(queryElement);
        });
    });
});