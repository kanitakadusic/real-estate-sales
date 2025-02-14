function mergeProperties(propertiesContainer, module, propertyType) {
    const propertiesList = module.filterProperties({ type: propertyType });
    propertiesContainer.innerHTML = '';

    if (!propertiesList.length) {
        propertiesContainer.className = 'empty';
        propertiesContainer.innerHTML = 'There are currently no properties of this type available.';
    } else {
        propertiesContainer.className = 'properties-list';

        propertiesList.forEach((property) => {
            const propertyClasses = {
                'apartment': ['property', 'apartment'],
                'house': ['property', 'house'],
                'workspace': ['property', 'workspace']
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
            pictureElement.alt = property.name;
            propertyElement.appendChild(pictureElement);

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.innerHTML = `${property.name}`;
            propertyElement.appendChild(titleElement);

            const detailsElement = document.createElement('div');
            detailsElement.classList.add('details');
            detailsElement.innerHTML = `Square footage: ${property.squareFootage}`;
            propertyElement.appendChild(detailsElement);

            const priceElement = document.createElement('div');
            priceElement.classList.add('price');
            priceElement.innerHTML = `Price: ${property.price}`;
            propertyElement.appendChild(priceElement);

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'Details';
            detailsButton.addEventListener('click', () => {
                // Increases a property's click count by one
                MarketingAjax.klikNekretnina(property.id);

                // Redirect to the details page with the property ID
                window.location.href = `/details.html?id=${encodeURIComponent(property.id)}`;
            });
            propertyElement.appendChild(detailsButton);

            propertiesContainer.appendChild(propertyElement);
        });
    }
}

const overallPropertiesContainer = document.getElementById('properties-container');

const apartmentsElement = document.getElementById('apartments');
const housesElement = document.getElementById('houses');
const workspacesElement = document.getElementById('workspaces');

function displayProperties(propertyListingInstance) {
    mergeProperties(apartmentsElement, propertyListingInstance, 'apartment');
    mergeProperties(housesElement, propertyListingInstance, 'house');
    mergeProperties(workspacesElement, propertyListingInstance, 'workspace');
}

const propertyListing = SpisakNekretnina();

function fnCallback(error, propertiesList) {
    if (error) {
        console.error('Greška prilikom dohvatanja nekretnina sa servera:', error);
        propertyListing.init([], []);
        showErrorImage(error, overallPropertiesContainer);
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
    PoziviAjax.getAllProperties(fnCallback);
} else {
    PoziviAjax.getTopPropertiesByLocation(propertyLocation, fnCallback);
}

document.getElementById('filter-button').addEventListener('click', () => {
    const criteria = {
        minPrice: parseFloat(document.getElementById('min-price').value) || 0,
        maxPrice: parseFloat(document.getElementById('max-price').value) || Infinity,
        minSquareFootage: parseFloat(document.getElementById('min-square-footage').value) || 0,
        maxSquareFootage: parseFloat(document.getElementById('max-square-footage').value) || Infinity
    };

    const filteredPropertiesList = propertyListing.filterProperties(criteria);

    // Increases the number of searches for each of the filtered properties by one
    MarketingAjax.novoFiltriranje(filteredPropertiesList.map(property => property.id));

    const temporaryPropertyListing = SpisakNekretnina();
    temporaryPropertyListing.init(filteredPropertiesList, []);    
    displayProperties(temporaryPropertyListing);
});

setInterval(() => {
    MarketingAjax.osvjeziPretrage(overallPropertiesContainer);
    MarketingAjax.osvjeziKlikove(overallPropertiesContainer);
}, 500);