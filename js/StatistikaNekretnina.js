let StatistikaNekretnina = function() {

    let propertyListing = SpisakNekretnina();

    let init = function(propertiesList, usersList) {
        propertyListing.init(propertiesList, usersList);
    }

    let getAverageByProperty = function(arr, prop) {
        return arr.length === 0 ? null : arr.reduce((sum, elem) => sum + elem[prop], 0) / arr.length;
    }

    let prosjecnaKvadratura = function(kriterij) {
        return getAverageByProperty(propertyListing.filtrirajNekretnine(kriterij), "kvadratura");
    }

    let outlier = function(kriterij, nazivSvojstva) {
        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);
        let average = getAverageByProperty(filteredProperties, nazivSvojstva);

        return filteredProperties.reduce((max, curr) => {
            return Math.abs(curr[nazivSvojstva] - average) > Math.abs(max[nazivSvojstva] - average) ? curr : max;
        }, filteredProperties[0]) || null;
    }

    let mojeNekretnine = function(korisnik) {
        let properties = propertyListing.filtrirajNekretnine({});
        return properties
            .filter(property => property.upiti.some(inquiry => inquiry.korisnik_id === korisnik.id))
            .sort((a, b) => b.upiti.length - a.upiti.length);
    }

    let isInSegment = function(x, a, b) {
        return x >= a && x <= b;
    }

    // required format: "dd.mm.yyyy."
    let getYear = function(dateString) {
        if (!(/^\d{2}\.\d{2}\.\d{4}\.$/).test(dateString)) return undefined;
        return Number(dateString.substring(6, 10));
    }

    // {od: a, do: b} <=> [a, b]
    let histogramCijena = function(periodi, rasponiCijena) {
        let properties = propertyListing.filtrirajNekretnine({});
        let histogram = [];

        for (let i = 0; i < periodi.length; i++) {
            if (periodi[i].od > periodi[i].do) continue;

            for (let j = 0; j < rasponiCijena.length; j++) {
                if (rasponiCijena[j].od > rasponiCijena[j].do) continue;

                let counter = 0;
                properties.forEach(property => {
                    if (
                        isInSegment(getYear(property.datum_objave), periodi[i].od, periodi[i].do) &&
                        isInSegment(property.cijena, rasponiCijena[j].od, rasponiCijena[j].do)
                    ) counter++;
                });

                histogram.push({
                    indeksPerioda: i,
                    indeksRasponaCijena: j,
                    brojNekretnina: counter
                });
            }
        }

        return histogram;
    }

    return {
        init,
        prosjecnaKvadratura,
        outlier,
        mojeNekretnine,
        histogramCijena
    }
}