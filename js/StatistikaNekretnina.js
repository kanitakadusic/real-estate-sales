let StatistikaNekretnina = function() {

    let propertyListing = SpisakNekretnina();

    let init = function(propertiesList, usersList) {
        propertyListing.init(propertiesList, usersList);
    }

    let isValidObject = function(o) {
        return typeof o === 'object' && !Array.isArray(o) && o !== null && o !== undefined;
    }

    let hasAllowedKeys = function(check, allowed) {
        return Object.keys(check).every(key => key in allowed && typeof check[key] === typeof allowed[key]);
    }

    let getAverage = function(array, mapper) {
        if (array.length === 0) return null;
        return array.reduce((sum, element) => sum + mapper(element), 0) / array.length;
    }

    let prosjecnaKvadratura = function(kriterij) {
        if (!isValidObject(kriterij)) {
            throw new Error("Criteria format is not valid.");
        }

        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);

        if (filteredProperties.length === 0) {
            throw new Error("Not a single property meets the given criteria.");
        }

        if (!hasAllowedKeys(kriterij, filteredProperties[0])) {
            throw new Error("Filtering by the given criteria is not allowed.");
        }

        return getAverage(filteredProperties, (element) => element["kvadratura"]);
    }

    let outlier = function(kriterij, nazivSvojstva) {
        if (!isValidObject(kriterij) || typeof nazivSvojstva !== 'string') return null;
        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);
        if (filteredProperties.length !== 0 && !hasAllowedKeys({ [nazivSvojstva]: Number() }, filteredProperties[0])) return null;
        let average = getAverage(filteredProperties, (element) => element[nazivSvojstva]);
        return filteredProperties.reduce((max, current) => {
            return Math.abs(current[nazivSvojstva] - average) > Math.abs(max[nazivSvojstva] - average) ? current : max;
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