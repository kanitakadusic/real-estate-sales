function showUserQueries() {
    const queriesElement = document.getElementById('user-queries');

    PoziviAjax.getMojiUpiti((error, queries) => {
        if (error) {
            console.error('Greška prilikom dohvatanja korisničkih upita sa servera:', error);
            return;
        }

        queries.forEach(query => {
            const { id_nekretnine, tekst_upita } = query;

            PoziviAjax.getNekretnina(id_nekretnine, (error, property) => {
                const queryElement = document.createElement('li');

                if (error) {
                    console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);
                    queryElement.innerHTML = `(${id_nekretnine})`;
                } else {
                    queryElement.innerHTML = `
                        <strong>${property.naziv}</strong> [${property.datum_objave}] (${id_nekretnine})<br>
                        ${tekst_upita}
                    `;
                }

                queriesElement.appendChild(queryElement);
            });
        });
    });
}

showUserQueries();