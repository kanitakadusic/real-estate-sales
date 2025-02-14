let SpisakNekretnina = function () {

    let propertiesList = [];
    let usersList = [];

    let init = function (propertiesList, usersList) {
        this.propertiesList = propertiesList;
        this.usersList = usersList;
    };

    let filterProperties = function (criteria) {
        return this.propertiesList.filter((property) => {
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
        init,
        filterProperties
    }
};