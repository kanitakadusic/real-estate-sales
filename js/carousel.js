function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (
        glavniElement === null || glavniElement === undefined || 
        sviElementi.length === 0 || 
        indeks < 0 || indeks >= sviElementi.length
    ) return null;

    glavniElement.innerHTML = `
        <div class="${sviElementi[indeks].className}">
            ${sviElementi[indeks].innerHTML}
        </div>
    `;

    function fnLijevo() {
        indeks--;
        if (indeks < 0) indeks = sviElementi.length - 1;

        glavniElement.innerHTML = `
            <div class="${sviElementi[indeks].className}">
                ${sviElementi[indeks].innerHTML}
            </div>
        `;
    }

    function fnDesno() {
        indeks++;
        if (indeks >= sviElementi.length) indeks = 0;

        glavniElement.innerHTML = `
            <div class="${sviElementi[indeks].className}">
                ${sviElementi[indeks].innerHTML}
            </div>
        `;
    }

    return {
        fnLijevo,
        fnDesno
    }
}