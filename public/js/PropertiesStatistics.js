let PropertiesStatistics = function () {

    let propertyListing = PropertiesListing();

    let genericProperty = null;

    const init = function (properties) {
        propertyListing.set(properties);

        if (properties.length) {
            genericProperty = extractKeys(properties[0]);
        }
    };

    const averageSquareFootage = function (criteria) {
        if (genericProperty === null) {
            throw new Error('No properties are available.');
        }

        if (!isObject(criteria)) {
            throw new Error('Criteria format is not valid.');
        }

        if (!hasAllowedKeys(criteria, genericProperty)) {
            throw new Error('Filtering by the given criteria is not possible.');
        }

        let filteredProperties = propertyListing.filter(criteria);
        if (!filteredProperties.length) {
            throw new Error('Not a single property meets the given criteria.');
        }

        return getAverage(filteredProperties, (e) => e['squareFootage']);
    };

    const outlier = function (criteria, propertyName) {
        if (genericProperty === null) {
            throw new Error('No properties are available.');
        }

        if (!isObject(criteria)) {
            throw new Error('Criteria format is not valid.');
        }

        if (!hasAllowedKeys(criteria, genericProperty)) {
            throw new Error('Filtering by the given criteria is not possible.');
        }

        if (typeof propertyName !== 'string') {
            throw new Error('Key format is not valid.');
        }

        if (!hasAllowedKeys({ [propertyName]: Number() }, genericProperty)) {
            throw new Error('Finding outlier for the given deviation key is not possible.');
        }

        let filteredProperties = propertyListing.filter(criteria);
        if (!filteredProperties.length) {
            throw new Error('Not a single property meets the given criteria.');
        }

        let average = getAverage(
            filteredProperties,
            (e) => e[propertyName]
        );

        return filteredProperties.reduce(
            (max, current) => largerOutlier(max, current, average, (e) => e[propertyName]),
            filteredProperties[0]
        );
    };

    // {start: a, end: b} <=> [a, b]
    const priceHistogram = function (yearRanges, priceRanges) {
        let properties = propertyListing.filter({});
        let histogram = [];

        for (let i = 0; i < yearRanges.length; i++) {
            if (yearRanges[i].start > yearRanges[i].end) continue;

            for (let j = 0; j < priceRanges.length; j++) {
                if (priceRanges[j].start > priceRanges[j].end) continue;

                let counter = 0;
                properties.forEach((property) => {
                    if (
                        isInSegment(new Date(property.createdAt).getFullYear(), yearRanges[i].start, yearRanges[i].end) &&
                        isInSegment(property.price, priceRanges[j].start, priceRanges[j].end)
                    ) counter++;
                });

                histogram.push({
                    yearIndex: i,
                    priceIndex: j,
                    numberOfProperties: counter
                });
            }
        }

        console.log(histogram);

        return histogram;
    };

    return {
        init,
        averageSquareFootage,
        outlier,
        priceHistogram
    }
};