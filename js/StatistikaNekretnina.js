let StatistikaNekretnina = function() {

    let propertyListing = SpisakNekretnina();

    let genericProperty = null;
    let genericUser = null;

    let getDefaultValue = function(value) {
        if (value === null || value === undefined) return value;

        if (typeof(value) === 'number') return 0;
        if (typeof(value) === 'string') return "";
        if (typeof(value) === 'boolean') return false;

        if (Array.isArray(value)) return [];
        if (typeof(value) === 'object') return {};
        if (typeof(value) === 'function') return () => {};

        if (typeof(value) === 'bigint') return 0n;
        if (typeof(value) === 'symbol') return Symbol();

        throw new Error("Unknown type.");
    }

    let extractKeys = function(reference) {
        return Object.keys(reference).reduce((object, key) => {
            object[key] = getDefaultValue(reference[key]);
            return object;
        }, {});
    }

    let init = function(properties, users) {
        propertyListing.init(properties, users);

        if (properties.length !== 0) genericProperty = extractKeys(properties[0]);
        if (users.length !== 0) genericUser = extractKeys(users[0]);
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
        if (!isValidObject(kriterij)) {
            throw new Error("Criteria format is not valid.");
        }

        if (typeof nazivSvojstva !== 'string') {
            throw new Error("Key format is not valid.");
        }

        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);

        if (filteredProperties.length === 0) {
            throw new Error("Not a single property meets the given criteria.");
        }

        if (!hasAllowedKeys({ [nazivSvojstva]: Number() }, filteredProperties[0])) {
            throw new Error("Filtering by the given criteria is not allowed.");
        }

        let average = getAverage(filteredProperties, (element) => element[nazivSvojstva]);

        return filteredProperties.reduce((max, current) => {
            return Math.abs(current[nazivSvojstva] - average) > Math.abs(max[nazivSvojstva] - average) ? current : max;
        }, filteredProperties[0]);
    }

    let mojeNekretnine = function(korisnik) {
        if (!isValidObject(korisnik)) {
            throw new Error("User format is not valid.");
        }

        let properties = propertyListing.filtrirajNekretnine({});

        if (properties.length === 0) {
            throw new Error("No properties are available.");
        }

        if (!("id" in korisnik && typeof korisnik.id === 'number')) {
            throw new Error("User ID must be defined (as a whole number).");
        }

        let filteredProperties = properties.filter(property => property.upiti.some(inquiry => inquiry.korisnik_id === korisnik.id));

        if (filteredProperties.length === 0) {
            throw new Error("The given user is not interested in any real estate.");
        }

        return filteredProperties.sort((a, b) => b.upiti.length - a.upiti.length);
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