let StatistikaNekretnina = function() {

    let spisakNekretnina = SpisakNekretnina(); // ?

    let nekretnine = []; // ?
    let korisnici = []; // ?

    let prosjek = {
        kvadratura,
        cijena,
        godina_izgradnje
    }

    const init = function() {
        this.prosjek.kvadratura = this.nekretnine.reduce((s, n) => s + n.kvadratura, 0) / this.nekretnine.length;
        this.prosjek.cijena = this.nekretnine.reduce((s, n) => s + n.cijena, 0) / this.nekretnine.length;
        this.prosjek.godina_izgradnje = this.nekretnine.reduce((s, n) => s + n.godina_izgradnje, 0) / this.nekretnine.length;

        // poziv init
    }

    // kriterij filter -> prosjek kvadrature || nan
    const prosjecnaKvadratura = function(kriterij) {
        let f = spisakNekretnina.filtrirajNekretnine(kriterij);
        return f.reduce((s, n) => s + n.kvadratura, 0) / f.length;
    }

    // kriterij filter -> max abs odstupanje svojstva od prosjeka
    const outlier = function(kriterij, nazivSvojstva) {
        let f = spisakNekretnina.filtrirajNekretnine(kriterij);
        return f.length === 0 ? null : f.reduce((maxElem, currElem) => {
            const maxDiff = Math.abs(maxElem[nazivSvojstva] - prosjek[nazivSvojstva]);
            const currDiff = Math.abs(currElem[nazivSvojstva] - prosjek[nazivSvojstva]);
            return currDiff > maxDiff ? currElem : maxElem;
        });
    }

    // bar jedan upit + sort po broju upita
    const mojeNekretnine = function(korisnik) {
        return nekretnine
            .filter(n => n.upiti.some(u => u.korisnik_id === korisnik.korisnik_id))
            .sort((a, b) => b.upiti.length - a.upiti.length);
    }

    const histogramCijena = function(periodi, rasponiCijena) {

    }

    return {
        init,
        prosjecnaKvadratura,
        outlier,
        mojeNekretnine,
        histogramCijena
    }
}