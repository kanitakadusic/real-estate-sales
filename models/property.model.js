module.exports = function (sequelize, DataTypes) {
    const Property = sequelize.define('Property', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        squareFootage: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.FLOAT
        },
        heating: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        constructionYear: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        underscored: true
    });

    Property.prototype.getInterests = async function () {
        const queries = await this.getQueries();
        const requests = await this.getRequests();
        const offers = await this.getOffers();

        return { queries, requests, offers };
    };

    return Property;
};