let StatistikaNekretnina = function() {

    let properties = [];
    let users = [];

    let propertyListing = SpisakNekretnina();

    let init = function(propertiesList, usersList) {
        properties = propertiesList;
        users = usersList;

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
        return properties
            .filter(property => property.upiti.some(inquiry => inquiry.korisnik_id === korisnik.id))
            .sort((a, b) => b.upiti.length - a.upiti.length);
    }

    let histogramCijena = function(periodi, rasponiCijena) {

    }

    return {
        init,
        prosjecnaKvadratura,
        outlier,
        mojeNekretnine,
        histogramCijena
    }
}