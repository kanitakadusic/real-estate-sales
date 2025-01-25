const propertyId = Number(getPropertyIdFromUrl());

let carousel = null;
let areAllQueriesLoaded = false;

const contentContainer = document.getElementById('content-container');

if (!propertyId) {
    showErrorImage(null, contentContainer);
} else {
    PoziviAjax.getNekretnina(propertyId, (error, property) => {
        if (error) {
            console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);
            showErrorImage(error, contentContainer);
        } else {
            document.getElementById('property-title').textContent = property.naziv;
            document.getElementById('property-square-footage').textContent = property.kvadratura;
            document.getElementById('property-price').textContent = property.cijena;
            document.getElementById('property-heating').textContent = property.tip_grijanja;
            document.getElementById('property-construction-year').textContent = property.godina_izgradnje;
            document.getElementById('property-description').textContent = property.opis;

            const publicationDate = new Date(property.datum_objave);
            document.getElementById('property-publication-date').textContent = publicationDate.toLocaleDateString();
    
            const locationElement = document.getElementById('property-location');
            locationElement.textContent = property.lokacija;
            locationElement.href = `http://localhost:3000/nekretnine.html?location=${encodeURIComponent(property.lokacija)}`;

            const carouselContent = document.getElementById('carousel-content');

            carousel = setCarousel(
                carouselContent,
                property.upiti.map(q => createQueryElement(q))
            );

            if (!carousel) {
                document.getElementById('carousel-buttons').style.display = 'none';

                const messageElement = document.createElement('p');
                messageElement.textContent = 'No queries have been made for this property.';
                carouselContent.replaceChildren(messageElement);
            }
        }
    });
}

document.getElementById('previous').addEventListener('click', () => {
    if (carousel) carousel.previous();
});

document.getElementById('next').addEventListener('click', () => {
    if (!carousel) return;

    if (carousel.index !== carousel.length - 1 || areAllQueriesLoaded) {
        carousel.next();
        return;
    }

    PoziviAjax.getNextUpiti(propertyId, Math.ceil(carousel.length / 3), (error, queries) => {
        if (error) {
            console.error('Greška prilikom učitavanja sljedećih upita:', error);

            if (error === 'Not Found') {
                areAllQueriesLoaded = true;
            } else {
                const feedbackElement = document.querySelector('#queries-container .feedback');
                feedbackElement.textContent = `Error: ${error}.`;
                feedbackElement.style.color = 'var(--error-light)';
                feedbackElement.style.display = 'block';
            }
        } else {
            console.log('Učitana je sljedeća tura upita');

            carousel.add(queries.map(q => createQueryElement(q)));
        }

        carousel.next();
    });
});

document.getElementById('interests-selection').addEventListener('change', (event) => {
    const selectedValue = event.target.value;

    const viewingDateElement = document.getElementById('viewing-date');
    const offerPriceElement = document.getElementById('offer-price');
    const relatedOffersElement = document.getElementById('related-offers');

    viewingDateElement.style.display = 'none';
    offerPriceElement.style.display = 'none';
    relatedOffersElement.style.display = 'none';

    if (selectedValue === 'request') {
        viewingDateElement.style.display = 'inline-block';
    } else if (selectedValue === 'offer') {
        offerPriceElement.style.display = 'inline-block';
        relatedOffersElement.style.display = 'inline-block';
    }
});

document.getElementById('send').addEventListener('click', () => {
    const queryTextElement = document.getElementById('query-text');
    const feedbackElement = document.querySelector('#interests-container .feedback');

    PoziviAjax.postUpit(propertyId, queryTextElement.value, (error, status) => {
        if (error) {
            console.error('Greška prilikom postavljanja upita:', error);

            feedbackElement.textContent = `Error: ${error}.`;
            feedbackElement.style.color = 'var(--error-light)';
            feedbackElement.style.display = 'block';
        } else {
            queryTextElement.value = '';

            feedbackElement.textContent = 'The query was successfully sent.';
            feedbackElement.style.color = 'var(--success-light)';
            feedbackElement.style.display = 'block';
        }
    });
});

function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function createQueryElement(query) {
    const queryElement = document.createElement('div');
    queryElement.classList.add('query');

    const strongElement = document.createElement('strong');
    strongElement.textContent = `User ID: ${query.korisnik_id}`;
    const userElement = document.createElement('p');
    userElement.appendChild(strongElement);
    queryElement.appendChild(userElement);

    const textElement = document.createElement('p');
    textElement.textContent = query.tekst;
    textElement.innerHTML = textElement.textContent.replace(/\n/g, '<br>');
    queryElement.appendChild(textElement);

    return queryElement;
}