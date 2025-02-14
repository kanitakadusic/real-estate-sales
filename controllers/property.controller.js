const { User, Query, Property } = require('../config/database');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({ raw: true });

        if (!properties.length) {
            return res.status(404).json({ greska: 'Nema nekretnina' });
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getTopPropertiesByLocation = async (req, res) => {
    const { location } = req.query;

    try {
        const properties = await Property.findAll({
            where: { location },
            limit: 5,
            order: [['createdAt', 'DESC']],
            raw: true
        });

        if (!properties.length) {
            return res.status(404).json({ greska: 'Nema nekretnina' });
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching top 5 properties:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id, { raw: true });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }
        
        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getPropertyInterests = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }

        const queries = await property.getQueries({ attributes: ['id', 'text'] });

        if (req.session.username) {
            const user = await User.findByUsername(req.session.username);
            if (user) {
                let requests = [];
                let offers = [];

                if (!user.isAdmin) {
                    requests = await property.getRequests({
                        where: { userId: user.id },
                        attributes: ['id', 'text', 'requestedDate', 'isApproved']
                    });
                    offers = await property.getOffers({
                        attributes: {
                            exclude: ['propertyId', 'createdAt', 'updatedAt']
                        }
                    });

                    for (const offer of offers) {
                        const rootOffer = await offer.getRootOffer();

                        if (rootOffer.userId != user.id) {
                            offer.price = undefined;
                        }

                        offer.userId = undefined;
                        offer.parentId = undefined;
                    }
                } else {
                    requests = await property.getRequests({
                        attributes: ['id', 'text', 'requestedDate', 'isApproved']
                    });
                    offers = await property.getOffers({
                        attributes: ['id', 'text', 'price', 'isRejected']
                    });
                }

                return res.status(200).json({ queries, requests, offers });
            }
        }

        const offers = await property.getOffers({ attributes: ['id', 'text', 'isRejected'] });

        res.status(200).json({ queries, requests: [], offers });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};