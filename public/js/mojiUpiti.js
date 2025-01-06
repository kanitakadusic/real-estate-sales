function showUserQueries() {
    const queriesElement = document.getElementById('user-queries');

    PoziviAjax.getMojiUpiti((error, queries) => {
        if (error) {
            window.alert(error);
            return;
        }

        queries.forEach(query => {
            const { id_nekretnine, tekst_upita } = query;

            PoziviAjax.getNekretnina(id_nekretnine, (error, property) => {
                if (error) {
                    window.alert(error);
                    return;
                }

                const queryElement = document.createElement('li');
                queryElement.innerHTML = `
                    <strong>${property.naziv}</strong> [${property.datum_objave}] (${id_nekretnine})<br>
                    ${tekst_upita}
                `;

                queriesElement.appendChild(queryElement);
            });
        });
    });
}

showUserQueries();