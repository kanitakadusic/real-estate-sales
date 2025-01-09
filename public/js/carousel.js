function setCarousel(containerElement, childElements, index = 0) {
    if (
        containerElement === null || containerElement === undefined || 
        childElements.length === 0 || 
        index < 0 || index >= childElements.length
    ) return null;

    containerElement.innerHTML = `
        <div class="${childElements[index].className}">
            ${childElements[index].innerHTML}
        </div>
    `;

    function previous() {
        index--;
        if (index < 0) index = childElements.length - 1;

        containerElement.innerHTML = `
            <div class="${childElements[index].className}">
                ${childElements[index].innerHTML}
            </div>
        `;
    }

    function next() {
        index++;
        if (index >= childElements.length) index = 0;

        containerElement.innerHTML = `
            <div class="${childElements[index].className}">
                ${childElements[index].innerHTML}
            </div>
        `;
    }

    return {
        previous: previous,
        next: next
    }
}