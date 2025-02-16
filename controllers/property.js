const { User, Property } = require('../config/database.js');
const locale = require('../locales/en.json');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({ raw: true });

        res.status(200).json({
            message: locale['200'],
            data: properties
        });
    } catch (error) {
        console.error('Error fetching properties data:', error);
        res.status(500).json({ message: locale['500'] });
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

        res.status(200).json({
            message: locale['200'],
            data: properties
        });
    } catch (error) {
        console.error('Error fetching top 5 properties:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id, { raw: true });
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
        }
        
        res.status(200).json({
            message: locale['200'],
            data: property
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.getPropertyInterests = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
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

                return res.status(200).json({
                    message: locale['200'],
                    data: { queries, requests, offers }
                });
            }
        }

        const offers = await property.getOffers({ attributes: ['id', 'text', 'isRejected'] });

        res.status(200).json({
            message: locale['200'],
            data: { queries, requests: [], offers }
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ message: locale['500'] });
    }
};