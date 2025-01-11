function setCarousel(containerElement, childElements, index = 0) {
    if (
        containerElement === null || containerElement === undefined || 
        childElements.length === 0 || 
        index < 0 || index >= childElements.length
    ) return null;

    containerElement.replaceChildren(childElements[index]);

    function previous() {
        if (--index < 0) index = childElements.length - 1;
        containerElement.replaceChildren(childElements[index]);
    }

    function next() {
        if (++index >= childElements.length) index = 0;
        containerElement.replaceChildren(childElements[index]);
    }

    function add(newChildElements) {
        childElements.push(...newChildElements);
    }

    return {
        previous: previous,
        next: next,
        add: add,
        get index() { return index; },
        get length() { return childElements.length; }
    }
}