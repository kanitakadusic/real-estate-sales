function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const propertyId = getPropertyIdFromUrl();
const contentContainer = document.getElementById('content-container');
    
if (!propertyId) {
    contentContainer.innerHTML = '';
    contentContainer.className = 'error';
    const imageElement = document.createElement('img');
    imageElement.src = '../resources/images/question-mark.svg';
    imageElement.alt = 'question-mark';
    contentContainer.appendChild(imageElement);
} else {
    PoziviAjax.getNekretnina(propertyId, (error, property) => {
        if (error) {
            console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);

            contentContainer.innerHTML = '';
            contentContainer.className = 'error';
            const imageElement = document.createElement('img');

            if (error === 'Bad Request') {
                imageElement.src = '../resources/images/400.svg';
                imageElement.alt = '400';
            } else {
                imageElement.src = '../resources/images/500.svg';
                imageElement.alt = '500';
            }

            contentContainer.appendChild(imageElement);
        } else {
            document.getElementById('property-title').textContent = property.naziv;
            document.getElementById('property-square-footage').textContent = property.kvadratura;
            document.getElementById('property-price').textContent = property.cijena;
    
            document.getElementById('property-heating').textContent = property.tip_grijanja;
            document.getElementById('property-construction-year').textContent = property.godina_izgradnje;
            document.getElementById('property-publication-date').textContent = property.datum_objave;
            document.getElementById('property-description').textContent = property.opis;
    
            const locationElement = document.getElementById('property-location');
            locationElement.textContent = property.lokacija;
            locationElement.href = `http://localhost:3000/nekretnine.html?location=${encodeURIComponent(property.lokacija)}`;
        }
    });
}

const carousel = setCarousel(
    document.getElementById('queries-container'),
    document.querySelectorAll('.query')
)

document.getElementById('previous').addEventListener('click', () => carousel.previous());
document.getElementById('next').addEventListener('click', () => carousel.next());