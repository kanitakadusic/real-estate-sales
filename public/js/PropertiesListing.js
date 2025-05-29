let PropertiesListing = function () {

    let propertiesList = [];

    const set = function (properties) {
        propertiesList = properties;
    };

    const filter = function (criteria) {
        return propertiesList.filter((property) => {
            if (criteria.type && property.type !== criteria.type) {
                return false;
            }

            if (criteria.minSquareFootage && property.squareFootage < criteria.minSquareFootage) {
                return false;
            }

            if (criteria.maxSquareFootage && property.squareFootage > criteria.maxSquareFootage) {
                return false;
            }

            if (criteria.minPrice && property.price < criteria.minPrice) {
                return false;
            }

            if (criteria.maxPrice && property.price > criteria.maxPrice) {
                return false;
            }

            return true;
        });
    };

    return {
        set,
        filter
    }
};