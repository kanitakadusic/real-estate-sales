ApiService.getUserQueries((error, { data: queries }) => {
    const queriesContainer = document.getElementById('queries-container');

    if (error) {
        console.error(error);
        showErrorImage(error, queriesContainer);
        return;
    }

    queries.forEach((query) => {
        const { propertyId, text } = query;

        const queryElement = document.createElement('div');
        queryElement.classList.add('query-container');

        ApiService.getPropertyById(propertyId, (error, { data: property }) => {
            const titleElement = document.createElement('div');

            if (error) {
                console.error(error);
                titleElement.textContent = propertyId;
            } else {
                const linkElement = document.createElement('a');
                linkElement.textContent = property.name;
                linkElement.href = `/details.html?id=${encodeURIComponent(propertyId)}`;
                titleElement.appendChild(linkElement);
            }
            
            queryElement.appendChild(titleElement);

            const textElement = document.createElement('p');
            textElement.textContent = text;
            textElement.innerHTML = textElement.textContent.replace(/\n/g, '<br>');
            queryElement.appendChild(textElement);

            queriesContainer.appendChild(queryElement);
        });
    });
});