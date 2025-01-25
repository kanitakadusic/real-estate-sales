let StatistikaNekretnina = function() {

    let propertyListing = SpisakNekretnina();

    let genericProperty = null;
    let genericUser = null;

    let init = function(properties, users) {
        propertyListing.init(properties, users);

        if (properties.length !== 0) {
            genericProperty = extractKeys(properties[0]);
        }

        if (users.length !== 0) {
            genericUser = extractKeys(users[0]);
        }
    }

    let prosjecnaKvadratura = function(kriterij) {
        if (genericProperty === null) {
            throw new Error("No properties are available.");
        }

        if (!isObject(kriterij)) {
            throw new Error("Criteria format is not valid.");
        }

        if (!hasAllowedKeys(kriterij, genericProperty)) {
            throw new Error("Filtering by the given criteria is not possible.");
        }

        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);

        if (filteredProperties.length === 0) {
            throw new Error("Not a single property meets the given criteria.");
        }

        return getAverage(filteredProperties, (e) => e["kvadratura"]);
    }

    let outlier = function(kriterij, nazivSvojstva) {
        if (genericProperty === null) {
            throw new Error("No properties are available.");
        }

        if (!isObject(kriterij)) {
            throw new Error("Criteria format is not valid.");
        }

        if (!hasAllowedKeys(kriterij, genericProperty)) {
            throw new Error("Filtering by the given criteria is not possible.");
        }

        if (typeof nazivSvojstva !== 'string') {
            throw new Error("Key format is not valid.");
        }

        if (!hasAllowedKeys({ [nazivSvojstva]: Number() }, genericProperty)) {
            throw new Error("Finding outlier for the given deviation key is not possible.");
        }

        let filteredProperties = propertyListing.filtrirajNekretnine(kriterij);

        if (filteredProperties.length === 0) {
            throw new Error("Not a single property meets the given criteria.");
        }

        let average = getAverage(
            propertyListing.filtrirajNekretnine({}),
            (e) => e[nazivSvojstva]
        );

        return filteredProperties.reduce(
            (max, current) => largerOutlier(max, current, average, (e) => e[nazivSvojstva]),
            filteredProperties[0]
        );
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
                        isInSegment(new Date(property.datum_objave).getFullYear(), periodi[i].od, periodi[i].do) &&
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
        histogramCijena
    }
}