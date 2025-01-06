function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    divReferenca.innerHTML = '';

    if (filtriraneNekretnine.length === 0) {
        divReferenca.innerHTML = '<p>Trenutno nema dostupnih nekretnina ovog tipa.</p>';
    } else {
        filtriraneNekretnine.forEach(nekretnina => {
            const nekretninaElement = document.createElement('div');

            if (tip_nekretnine === 'Stan') {
                nekretninaElement.classList.add('nekretnina', 'stan');
                nekretninaElement.id = `${nekretnina.id}`;
            } else if (tip_nekretnine === 'Kuća') {
                nekretninaElement.classList.add('nekretnina', 'kuca');
                nekretninaElement.id = `${nekretnina.id}`;
            } else {
                nekretninaElement.classList.add('nekretnina', 'pp');
                nekretninaElement.id = `${nekretnina.id}`;
            }

            const pretrageDiv = document.createElement('div');
            pretrageDiv.id = `pretrage-${nekretnina.id}`;
            pretrageDiv.textContent = `pretrage: ${nekretnina.pretrage || 0}`;
            nekretninaElement.appendChild(pretrageDiv);

            const klikoviDiv = document.createElement('div');
            klikoviDiv.id = `klikovi-${nekretnina.id}`;
            klikoviDiv.textContent = `klikovi: ${nekretnina.klikovi || 0}`;
            nekretninaElement.appendChild(klikoviDiv);

            const slikaElement = document.createElement('img');
            slikaElement.classList.add('slika-nekretnine');
            slikaElement.src = `../resources/images/${nekretnina.id}.jpg`;
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
            //detaljiDugme.href = '../html/detalji.html';
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';
            detaljiDugme.addEventListener('click', () => {
                MarketingAjax.klikNekretnina(nekretnina.id);
            });
            nekretninaElement.appendChild(detaljiDugme);

            divReferenca.appendChild(nekretninaElement);
        });
    }
}

const listaNekretnina = []
const listaKorisnika = []

const divStan = document.getElementById('stan');
const divKuca = document.getElementById('kuca');
const divPp = document.getElementById('pp');

let nekretnine = SpisakNekretnina();

PoziviAjax.getNekretnine((error, listaNekretnina) => {
    if (error) {
        console.error('Greška prilikom dohvatanja nekretnina sa servera:', error);
    } else {
        nekretnine.init(listaNekretnina, listaKorisnika);

        spojiNekretnine(divStan, nekretnine, 'Stan');
        spojiNekretnine(divKuca, nekretnine, 'Kuća');
        spojiNekretnine(divPp, nekretnine, 'Poslovni prostor');
    }
});

function filtrirajNekretnine(filtriraneNekretnine) {
    const filtriraneNekretnineInstance = SpisakNekretnina();
    filtriraneNekretnineInstance.init(filtriraneNekretnine, listaKorisnika);

    spojiNekretnine(divStan, filtriraneNekretnineInstance, 'Stan');
    spojiNekretnine(divKuca, filtriraneNekretnineInstance, 'Kuća');
    spojiNekretnine(divPp, filtriraneNekretnineInstance, 'Poslovni prostor');
}

function filtrirajOnClick() {
    const kriterij = {
        min_cijena: parseFloat(document.getElementById('minCijena').value) || 0,
        max_cijena: parseFloat(document.getElementById('maxCijena').value) || Infinity,
        min_kvadratura: parseFloat(document.getElementById('minKvadratura').value) || 0,
        max_kvadratura: parseFloat(document.getElementById('maxKvadratura').value) || Infinity
    };

    const filtriraneNekretnine = nekretnine.filtrirajNekretnine(kriterij);

    MarketingAjax.novoFiltriranje(
        filtriraneNekretnine.map(nekretnina => nekretnina.id)
    );

    filtrirajNekretnine(filtriraneNekretnine);
}

document.getElementById('dugmePretraga').addEventListener('click', filtrirajOnClick);

setInterval(() => {
    MarketingAjax.osvjeziPretrage(document.getElementById('divNekretnine'));
    MarketingAjax.osvjeziKlikove(document.getElementById('divNekretnine'));
}, 500);