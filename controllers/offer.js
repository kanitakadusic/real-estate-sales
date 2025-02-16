const { User, Offer, Property } = require('../config/database.js');
const locale = require('../locales/en.json');

exports.createPropertyOffer = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    const { propertyId } = req.params;

    const { text, price, isRejected, parentId } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
        }

        if (price < 0) {
            return res.status(400).json({ message: locale['400'] });
        }

        if (parentId !== null) {
            const parentOffer = await Offer.findByPk(parentId);
            if (!parentOffer) {
                return res.status(404).json({ message: locale['404'] });
            }

            const rootOffer = await parentOffer.getRootOffer();

            if (user.id != rootOffer.userId && !user.isAdmin) {
                return res.status(403).json({ message: locale['403'] });
            }
            if (propertyId != rootOffer.propertyId) {
                return res.status(400).json({ message: locale['400'] });
            }
            if (rootOffer.isRejected) {
                return res.status(409).json({ message: locale['409'] });
            }

            if (isRejected) {
                const relatedOffers = await rootOffer.getRelatedOffers();

                await Promise.all(relatedOffers.map(async (offer) => {
                    offer.isRejected = true;
                    await offer.save();
                }));
            }
        }

        await Offer.create({
            propertyId,
            userId: user.id,
            text,
            price,
            isRejected,
            parentId
        });

        res.status(201).json({ message: locale['201'] });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ message: locale['500'] });
    }
};