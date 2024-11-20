function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (
        glavniElement === null || glavniElement === undefined || 
        sviElementi.length === 0 || 
        indeks < 0 || indeks >= sviElementi.length
    ) return null;

    glavniElement.innerHTML = sviElementi[indeks].innerHTML;

    function fnLijevo() {
        indeks--;
        if (indeks == -1) indeks = sviElementi.length - 1;
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    function fnDesno() {
        indeks++;
        if (indeks == sviElementi.length) indeks = 0;
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    return {
        fnLijevo,
        fnDesno
    }
}