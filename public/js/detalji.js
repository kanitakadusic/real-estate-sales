function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function mergePropertyDetails(property) {
    document.getElementById('title').textContent = property.naziv;
    document.getElementById('square-footage').textContent = property.kvadratura;
    document.getElementById('price').textContent = property.cijena;

    document.getElementById('heating').textContent = property.tip_grijanja;
    document.getElementById('location').textContent = property.lokacija;
    document.getElementById('construction-year').textContent = property.godina_izgradnje;
    document.getElementById('publication-date').textContent = property.datum_objave;
    document.getElementById('description').textContent = property.opis;
}

document.addEventListener('DOMContentLoaded', () => {
    const propertyId = getPropertyIdFromUrl();
    
    if (!propertyId) {
        const contentElement = document.getElementById('content-container');
        contentElement.innerHTML = '<div class="heading">Which property do you want details about?</div>';
        return;
    }

    PoziviAjax.getNekretnina(propertyId, (error, property) => {
        if (error) {
            console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);
        } else {
            mergePropertyDetails(property);
        }
    });
});



const carousel = setCarousel(
    document.getElementById('queries-container'),
    document.querySelectorAll('.query')
)

document.getElementById('previous').addEventListener('click', () => carousel.previous());
document.getElementById('next').addEventListener('click', () => carousel.next());