function mergeProperties(propertiesContainer, module, propertyType) {
    const propertiesList = module.filtrirajNekretnine({ tip_nekretnine: propertyType });
    propertiesContainer.innerHTML = '';

    if (propertiesList.length === 0) {
        propertiesContainer.className = 'empty';
        propertiesContainer.innerHTML = 'There are currently no properties of this type available.';
    } else {
        propertiesContainer.className = 'properties-list';

        propertiesList.forEach(property => {
            const propertyClasses = {
                'Stan': ['property', 'apartment'],
                'Kuća': ['property', 'house'],
                'Poslovni prostor': ['property', 'workspace'],
            };
            
            const propertyElement = document.createElement('div');
            propertyElement.id = `${property.id}`;
            const classes = propertyClasses[propertyType] || ['property'];
            propertyElement.classList.add(...classes);

            const searchesElement = document.createElement('span');
            searchesElement.id = `searches-${property.id}`;
            searchesElement.classList.add('marketing');
            searchesElement.textContent = `Total searches: ${property.pretrage || 0}`;
            propertyElement.appendChild(searchesElement);

            const clicksElement = document.createElement('span');
            clicksElement.id = `clicks-${property.id}`;
            clicksElement.classList.add('marketing');
            clicksElement.textContent = `Total clicks: ${property.klikovi || 0}`;
            propertyElement.appendChild(clicksElement);

            const pictureElement = document.createElement('img');
            pictureElement.classList.add('picture');
            pictureElement.src = `../resources/images/${property.id}.jpg`;
            pictureElement.alt = property.naziv;
            propertyElement.appendChild(pictureElement);

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.innerHTML = `${property.naziv}`;
            propertyElement.appendChild(titleElement);

            const detailsElement = document.createElement('div');
            detailsElement.classList.add('details');
            detailsElement.innerHTML = `Square footage: ${property.kvadratura} m²`;
            propertyElement.appendChild(detailsElement);

            const priceElement = document.createElement('div');
            priceElement.classList.add('price');
            priceElement.innerHTML = `Price: ${property.cijena} €`;
            propertyElement.appendChild(priceElement);

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'Details';
            detailsButton.addEventListener('click', () => {
                // Increases a property's click count by one
                MarketingAjax.klikNekretnina(property.id);

                // Redirect to the details page with the property ID
                window.location.href = `http://localhost:3000/detalji.html?id=${encodeURIComponent(property.id)}`;
            });
            propertyElement.appendChild(detailsButton);

            propertiesContainer.appendChild(propertyElement);
        });
    }
}

const apartmentsElement = document.getElementById('apartments');
const housesElement = document.getElementById('houses');
const workspacesElement = document.getElementById('workspaces');

function displayProperties(propertyListingInstance) {
    mergeProperties(apartmentsElement, propertyListingInstance, 'Stan');
    mergeProperties(housesElement, propertyListingInstance, 'Kuća');
    mergeProperties(workspacesElement, propertyListingInstance, 'Poslovni prostor');
}

const propertyListing = SpisakNekretnina();

function fnCallback(error, propertiesList) {
    if (error) {
        console.error('Greška prilikom dohvatanja nekretnina sa servera:', error);
    } else {
        propertyListing.init(propertiesList, []);
        displayProperties(propertyListing);
    }
}

function getPropertyLocationFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('location');
}

const propertyLocation = getPropertyLocationFromUrl();

if (!propertyLocation) {
    PoziviAjax.getNekretnine(fnCallback);
} else {
    PoziviAjax.getTop5Nekretnina(propertyLocation, fnCallback);
}

document.getElementById('filter-button').addEventListener('click', () => {
    const criteria = {
        min_cijena: parseFloat(document.getElementById('min-price').value) || 0,
        max_cijena: parseFloat(document.getElementById('max-price').value) || Infinity,
        min_kvadratura: parseFloat(document.getElementById('min-square-footage').value) || 0,
        max_kvadratura: parseFloat(document.getElementById('max-square-footage').value) || Infinity
    };

    const filteredPropertiesList = propertyListing.filtrirajNekretnine(criteria);

    // Increases the number of searches for each of the filtered properties by one
    MarketingAjax.novoFiltriranje(filteredPropertiesList.map(property => property.id));

    const temporaryPropertyListing = SpisakNekretnina();
    temporaryPropertyListing.init(filteredPropertiesList, []);    
    displayProperties(temporaryPropertyListing);
});

setInterval(() => {
    MarketingAjax.osvjeziPretrage(document.getElementById('properties-container'));
    MarketingAjax.osvjeziKlikove(document.getElementById('properties-container'));
}, 500);