module.exports = function (sequelize, DataTypes) {
    const Offer = sequelize.define('Offer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Property',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        text: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.FLOAT
        },
        isRejected: {
            type: DataTypes.BOOLEAN
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Offer',
                key: 'id'
            }
        }
    }, {
        underscored: true
    });

    Offer.prototype.getRootOffer = async function () {
        let offer = this;

        while (true) {
            let parentOffer = await offer.getParentOffer();
            if (parentOffer === null) break;
            offer = parentOffer;
        }

        return offer;
    };

    Offer.prototype.getAllChildOffers = async function () {
        const allChildOffers = [];
        const stack = [];

        const directChildren = await this.getChildOffers();
        stack.push(...directChildren);

        while (stack.length > 0) {
            let currentOffer = stack.pop();
            allChildOffers.push(currentOffer);

            let childOffers = await currentOffer.getChildOffers();
            stack.push(...childOffers);
        }

        return allChildOffers;
    };

    Offer.prototype.getRelatedOffers = async function () {
        const rootOffer = await this.getRootOffer();
        const allChildOffers = await rootOffer.getAllChildOffers();
        return [rootOffer, ...allChildOffers];
    };

    return Offer;
};