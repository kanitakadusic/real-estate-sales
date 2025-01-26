const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Ponuda', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nekretnina_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Nekretnina',
                key: 'id'
            }
        },
        korisnik_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Korisnik',
                key: 'id'
            }
        },
        tekst: {
            type: DataTypes.TEXT
        },
        cijenaPonude: {
            type: DataTypes.FLOAT
        },
        datumPonude: {
            type: DataTypes.DATE
        },
        odbijenaPonuda: {
            type: DataTypes.BOOLEAN
        },
        parentOfferId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Ponuda',
                key: 'id'
            }
        }
    },
    {
        tableName: 'Ponuda'
    }
);

Offer.rootOffer = function(offers, offerId) {
    let offer = offers.find((o) => o.id == offerId);

    while (offer && offer.parentOfferId !== null) {
        offer = offers.find((o) => o.id == offer.parentOfferId);
    }

    return offer || null;
}

Offer.childOffers = function(offers, offerId) {
    const children = [];
    const stack = [offerId];

    while (stack.length > 0) {
        const currentParentId = stack.pop();

        for (const offer of offers) {
            if (offer.parentOfferId == currentParentId) {
                children.push(offer);
                stack.push(offer.id);
            }
        }
    }

    return children;
}

Object.defineProperty(Offer.prototype, 'vezanePonude', {
    get: async function () {
        const offers = await Offer.findAll();

        const rootOffer = Offer.rootOffer(offers, this.id);
        if (rootOffer) {
            const childOffers = Offer.childOffers(offers, rootOffer.id);
            return [rootOffer, ...childOffers];
        }

        return [];
    }
});

module.exports = Offer;