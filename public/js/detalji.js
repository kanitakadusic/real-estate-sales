function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function mergePropertyDetails(property) {
    document.getElementById('property-title').textContent = property.naziv;
    document.getElementById('property-square-footage').textContent = property.kvadratura;
    document.getElementById('property-price').textContent = property.cijena;

    document.getElementById('property-heating').textContent = property.tip_grijanja;
    document.getElementById('property-construction-year').textContent = property.godina_izgradnje;
    document.getElementById('property-publication-date').textContent = property.datum_objave;
    document.getElementById('property-description').textContent = property.opis;

    const location = document.getElementById('property-location');
    //location.href = '#';
    location.textContent = property.lokacija;
    location.addEventListener('click', () => {
        PoziviAjax.getTop5Nekretnina(property.lokacija, (error, properties) => {
            if (error) {
                console.error('Greška prilikom dohvatanja top 5 nekretnina sa servera:', error);
            } else {
                console.log(properties);
            }
        });
    });
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