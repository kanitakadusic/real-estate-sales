module.exports = function(sequelize, DataTypes) {
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
    
    Object.defineProperty(Offer.prototype, 'vezanePonude', {
        get: async function () {            
            const rootOffer = await this.getRootOffer();
            const allChildOffers = await rootOffer.getAllChildOffers();
            return [rootOffer, ...allChildOffers];
        }
    });

    return Offer;
};