function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {

    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    divReferenca.innerHTML = `<h1>${tip_nekretnine}</h1>`;

    if (filtriraneNekretnine.length === 0) {
        divReferenca.innerHTML += '<p>Trenutno nema dostupnih nekretnina ovog tipa.</p>';
    } else {
        const nekretnineKontejner = document.createElement('div');
        nekretnineKontejner.classList.add('grid-lista-nekretnina');

        filtriraneNekretnine.forEach(nekretnina => {
            const nekretninaElement = document.createElement('div');

            if (tip_nekretnine === "Stan") {
                nekretninaElement.classList.add('nekretnina');
            } else if (tip_nekretnine === "Kuća") {
                nekretninaElement.classList.add('nekretnina', 'kuca');
            } else {
                nekretninaElement.classList.add('nekretnina', 'pp');
            }

            const slikaElement = document.createElement('img');
            slikaElement.classList.add('slika-nekretnine');
            slikaElement.src = `../resources/images/placeholder.jpg`;
            slikaElement.alt = nekretnina.naziv;
            nekretninaElement.appendChild(slikaElement);

            const detaljiElement = document.createElement('div');
            detaljiElement.classList.add('detalji-nekretnine');
            detaljiElement.innerHTML = `
                <h3>${nekretnina.naziv}</h3>
                <p>Kvadratura: ${nekretnina.kvadratura} m²</p>
            `;
            nekretninaElement.appendChild(detaljiElement);

            const cijenaElement = document.createElement('div');
            cijenaElement.classList.add('cijena-nekretnine');
            cijenaElement.innerHTML = `<p>Cijena: ${nekretnina.cijena} BAM</p>`;
            nekretninaElement.appendChild(cijenaElement);

            const detaljiDugme = document.createElement('a');
            detaljiDugme.href = '../html/detalji.html';
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';
            nekretninaElement.appendChild(detaljiDugme);

            nekretnineKontejner.appendChild(nekretninaElement);
        });

        divReferenca.appendChild(nekretnineKontejner);
    }
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");