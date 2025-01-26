const propertyId = Number(getPropertyIdFromUrl());
let isAdmin = false;

let queriesCarousel = null;
let requestsCarousel = null;
let offersCarousel = null;

const contentContainer = document.getElementById('content-container');
const interestsSelectionElement = document.getElementById('interests-selection');
const requestDateInput = document.getElementById('request-date');
const relatedRequestsSelect = document.getElementById('related-requests');
const requestApprovalLabel = document.getElementById('request-label');
const requestApprovalCheckbox = document.getElementById('request-approval');
const relatedOffersSelect = document.getElementById('related-offers');
const offerPriceInput = document.getElementById('offer-price');
const offerRejectionLabel = document.getElementById('offer-label');
const offerRejectionCheckbox = document.getElementById('offer-rejection');
const interestTextInput = document.getElementById('interest-text');
const sendButton = document.getElementById('send');

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
        }
    });

    PoziviAjax.getKorisnik((error, user) => {
        if (error) {
            console.error('Greška prilikom preuzimanja korisničkih podataka:', error);

            requestDateInput.disabled = true;
            relatedOffersSelect.disabled = true;
            offerPriceInput.disabled = true;
            offerRejectionCheckbox.disabled = true;
            interestTextInput.disabled = true;
            sendButton.disabled = true;
        } else {
            isAdmin = user.admin;
        }
    });

    PoziviAjax.getInterests(propertyId, (error, interests) => {
        if (error) {
            console.error('Greška prilikom preuzimanja interesovanja za nekretninu:', error);
        } else {
            if (isAdmin) {
                interests.requests.forEach((request) => {
                    const option = document.createElement("option");
                    option.value = request.id;
                    option.textContent = request.id;
                    relatedRequestsSelect.appendChild(option);
                });

                if (interests.requests.length === 0) {
                    relatedRequestsSelect.disabled = true;
                }
            }

            interests.offers.forEach((offer) => {
                if (offer.cijenaPonude) {
                    const option = document.createElement("option");
                    option.value = offer.id;
                    option.textContent = offer.id;
                    relatedOffersSelect.appendChild(option);
                }
            });

            if (interests.offers.length === 0) {
                relatedOffersSelect.disabled = true;
            }

            queriesCarousel = initializeCarousel(
                document.getElementById('queries-container'),
                interests.queries.map((q) => createInterestElement(q, 'query'))
            );
            requestsCarousel = initializeCarousel(
                document.getElementById('requests-container'),
                interests.requests.map((r) => createInterestElement(r, 'request'))
            );
            offersCarousel = initializeCarousel(
                document.getElementById('offers-container'),
                interests.offers.map((o) => createInterestElement(o, 'offer'))
            );
        }
    });
}

document.querySelector('#queries-container .previous').addEventListener('click', () => {
    if (queriesCarousel) queriesCarousel.previous();
});
document.querySelector('#queries-container .next').addEventListener('click', () => {
    if (queriesCarousel) queriesCarousel.next();
});

document.querySelector('#requests-container .previous').addEventListener('click', () => {
    if (requestsCarousel) requestsCarousel.previous();
});
document.querySelector('#requests-container .next').addEventListener('click', () => {
    if (requestsCarousel) requestsCarousel.next();
});

document.querySelector('#offers-container .previous').addEventListener('click', () => {
    if (offersCarousel) offersCarousel.previous();
});
document.querySelector('#offers-container .next').addEventListener('click', () => {
    if (offersCarousel) offersCarousel.next();
});

interestsSelectionElement.addEventListener('change', () => {
    requestDateInput.style.display = 'none';
    relatedRequestsSelect.style.display = 'none';
    requestApprovalLabel.style.display = 'none';
    relatedOffersSelect.style.display = 'none';
    offerPriceInput.style.display = 'none';
    offerRejectionLabel.style.display = 'none';

    if (interestsSelectionElement.value === 'request') {
        if (!isAdmin) {
            requestDateInput.style.display = 'inline-block';
        } else {
            relatedRequestsSelect.style.display = 'inline-block';
            requestApprovalLabel.style.display = 'inline-block';
        }
    } else if (interestsSelectionElement.value === 'offer') {
        relatedOffersSelect.style.display = 'inline-block';
        offerPriceInput.style.display = 'inline-block';
        offerRejectionLabel.style.display = 'inline-block';
    }
});

sendButton.addEventListener('click', () => {
    const feedbackElement = document.querySelector('#interests-container .feedback');

    const feedbackHandler = (error, status) => {
        if (error) {
            console.error('Greška prilikom postavljanja interesovanja:', error);

            feedbackElement.textContent = `Error: ${error}.`;
            feedbackElement.style.color = 'var(--error-light)';
            feedbackElement.style.display = 'block';
        } else {
            feedbackElement.textContent = 'The interest was successfully sent.';
            feedbackElement.style.color = 'var(--success-light)';
            feedbackElement.style.display = 'block';
        }
    };

    if (interestsSelectionElement.value === 'query') {
        PoziviAjax.postUpit(
            propertyId,
            interestTextInput.value,
            feedbackHandler
        );
    } else if (interestsSelectionElement.value === 'request') {
        if (!isAdmin) {
            PoziviAjax.postZahtjev(
                propertyId,
                interestTextInput.value,
                requestDateInput.value,
                feedbackHandler
            );
        } else {
            PoziviAjax.putZahtjev(
                propertyId,
                relatedRequestsSelect.value,
                requestApprovalCheckbox.checked,
                interestTextInput.value,
                feedbackHandler
            );
        }
    } else if (interestsSelectionElement.value === 'offer') {
        PoziviAjax.postPonuda(
            propertyId,
            interestTextInput.value,
            offerPriceInput.value,
            new Date(),
            relatedOffersSelect.value,
            offerRejectionCheckbox.checked,
            feedbackHandler
        );
    }
});

function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function initializeCarousel(container, content) {
    const carousel = setCarousel(
        container.querySelector('.carousel-content'),
        content
    );

    if (!carousel) {
        container.style.display = 'none';
        container.previousElementSibling.style.display = 'none';
    }

    return carousel;
}

function createInterestElement(interest, interestType) {
    const interestElement = document.createElement('div');
    interestElement.classList.add('interest');

    let element = document.createElement('p');
    element.innerHTML = `<strong>ID:</strong> ${interest.id}`;
    interestElement.appendChild(element);

    if (interestType === 'request') {
        if (interest.korisnik_id) {
            element = document.createElement('p');
            element.innerHTML = `<strong>User ID:</strong> ${interest.korisnik_id}`;
            interestElement.appendChild(element);
        }

        element = document.createElement('p');
        const date = new Date(interest.trazeniDatum);
        element.innerHTML = `<strong>Date:</strong> ${date.toLocaleString()}`;
        interestElement.appendChild(element);

        element = document.createElement('p');
        const status = interest.odobren ? 'approved' : 'rejected';
        element.innerHTML = `<strong>Status:</strong> ${status}`;
        interestElement.appendChild(element);
    } else if (interestType === 'offer') {
        element = document.createElement('p');
        const status = interest.odbijenaPonuda ? 'rejected' : 'approved';
        element.innerHTML = `<strong>Status:</strong> ${status}`;
        interestElement.appendChild(element);
    }

    element = document.createElement('p');
    element.textContent = interest.tekst;
    element.innerHTML = element.textContent.replace(/\n/g, '<br>');
    interestElement.appendChild(element);

    return interestElement;
}