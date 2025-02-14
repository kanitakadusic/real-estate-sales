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
    PoziviAjax.getPropertyById(propertyId, (error, property) => {
        if (error) {
            console.error('Greška prilikom dohvatanja detalja nekretnine sa servera:', error);
            showErrorImage(error, contentContainer);
        } else {
            document.getElementById('property-title').textContent = property.name;
            document.getElementById('property-square-footage').textContent = property.squareFootage;
            document.getElementById('property-price').textContent = property.price;
            document.getElementById('property-heating').textContent = property.heating;
            document.getElementById('property-construction-year').textContent = property.constructionYear;
            document.getElementById('property-description').textContent = property.description;

            const publicationDate = new Date(property.createdAt);
            document.getElementById('property-publication-date').textContent = publicationDate.toLocaleDateString();
    
            const locationElement = document.getElementById('property-location');
            locationElement.textContent = property.location;
            locationElement.href = `/properties.html?location=${encodeURIComponent(property.location)}`;
        }
    });

    PoziviAjax.getLoggedInUser((error, user) => {
        if (error) {
            console.error('Greška prilikom preuzimanja korisničkih podataka:', error);

            requestDateInput.disabled = true;
            relatedOffersSelect.disabled = true;
            offerPriceInput.disabled = true;
            offerRejectionCheckbox.disabled = true;
            interestTextInput.disabled = true;
            sendButton.style.display = 'none';
        } else {
            isAdmin = user.isAdmin;
        }
    });

    PoziviAjax.getPropertyInterests(propertyId, (error, interests) => {
        if (error) {
            console.error('Greška prilikom preuzimanja interesovanja za nekretninu:', error);
        } else {
            if (isAdmin) {
                interests.requests.forEach((request) => {
                    const option = document.createElement('option');
                    option.value = request.id;
                    option.textContent = request.id;
                    relatedRequestsSelect.appendChild(option);
                });

                if (!interests.requests.length) {
                    relatedRequestsSelect.disabled = true;
                }
            }

            const option = document.createElement('option');
            option.value = 'initial';
            option.textContent = 'Initial offer';
            relatedOffersSelect.appendChild(option);

            interests.offers.forEach((offer) => {
                if (offer.price) {
                    const option = document.createElement('option');
                    option.value = offer.id;
                    option.textContent = offer.id;
                    relatedOffersSelect.appendChild(option);
                }
            });

            if (!interests.offers.length) {
                relatedOffersSelect.disabled = true;
            }

            queriesCarousel = initializeCarousel(
                document.getElementById('queries-container'),
                interests.queries.map((query) => createInterestElement(query, 'query'))
            );
            requestsCarousel = initializeCarousel(
                document.getElementById('requests-container'),
                interests.requests.map((request) => createInterestElement(request, 'request'))
            );
            offersCarousel = initializeCarousel(
                document.getElementById('offers-container'),
                interests.offers.map((offer) => createInterestElement(offer, 'offer'))
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
    const feedbackElement = document.querySelector('#interests-container .feedback');
    if (feedbackElement) {
        feedbackElement.style.display = 'none';
    }

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
    if (feedbackElement) {
        feedbackElement.style.display = 'none';
    }

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
        if (interestTextInput.value) {
            PoziviAjax.createPropertyQuery(
                propertyId,
                interestTextInput.value,
                feedbackHandler
            );

            interestTextInput.value = '';
        }
    } else if (interestsSelectionElement.value === 'request') {
        if (!isAdmin) {
            if (requestDateInput.value) {
                PoziviAjax.createPropertyRequest(
                    propertyId,
                    interestTextInput.value,
                    requestDateInput.value,
                    feedbackHandler
                );

                interestTextInput.value = '';
                requestDateInput.value = '';
            }
        } else {
            if (relatedRequestsSelect.value && (requestApprovalCheckbox.checked || interestTextInput.value)) {
                PoziviAjax.updateRequestStatusByAdmin(
                    propertyId,
                    relatedRequestsSelect.value,
                    requestApprovalCheckbox.checked,
                    interestTextInput.value,
                    feedbackHandler
                );
    
                requestApprovalCheckbox.checked = false;
                interestTextInput.value = '';
            }
        }
    } else if (interestsSelectionElement.value === 'offer') {
        if (offerPriceInput.value || offerRejectionCheckbox.checked) {
            PoziviAjax.createPropertyOffer(
                propertyId,
                interestTextInput.value,
                offerPriceInput.value,
                offerRejectionCheckbox.checked,
                relatedOffersSelect.value === 'initial' ? null : relatedOffersSelect.value,
                feedbackHandler
            );

            interestTextInput.value = '';
            offerPriceInput.value = '';
            offerRejectionCheckbox.checked = false;
        }
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
        element = document.createElement('p');
        const date = new Date(interest.requestedDate);
        element.innerHTML = `<strong>Date:</strong> ${date.toLocaleString()}`;
        interestElement.appendChild(element);

        element = document.createElement('p');
        const status = interest.isApproved ? 'approved' : 'rejected';
        element.innerHTML = `<strong>Status:</strong> ${status}`;
        interestElement.appendChild(element);
    } else if (interestType === 'offer') {
        if (interest.price) {
            element = document.createElement('p');
            element.innerHTML = `<strong>Price:</strong> ${interest.price}`;
            interestElement.appendChild(element);
        }

        element = document.createElement('p');
        const status = interest.isRejected ? 'rejected' : 'approved';
        element.innerHTML = `<strong>Status:</strong> ${status}`;
        interestElement.appendChild(element);
    }

    element = document.createElement('p');
    element.textContent = interest.text;
    element.innerHTML = element.textContent.replace(/\n/g, '<br>');
    interestElement.appendChild(element);

    return interestElement;
}