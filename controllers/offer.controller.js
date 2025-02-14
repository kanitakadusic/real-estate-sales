const { User, Offer, Property } = require('../config/database');

exports.createPropertyOffer = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { propertyId } = req.params;

    const { text, price, isRejected, parentId } = req.body;

    if (!price && !isRejected) {
        return res.status(400).json({ greska: `Potrebno je ili dati cjenovnu kontraponudu ili odbiti ponudu ili oboje.` });
    }

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        if (parentId !== null) {
            const parentOffer = await Offer.findByPk(parentId);
            if (!parentOffer) {
                return res.status(404).json({ greska: `Ponuda sa id-em ${parentId} ne postoji` });
            }

            const rootOffer = await parentOffer.getRootOffer();

            if (!user.isAdmin && user.id != rootOffer.userId) {
                return res.status(403).json({ greska: 'Zabranjen pristup' });
            }

            if (propertyId != rootOffer.propertyId) {
                return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} nema ponudu sa id-em ${parentId}` });
            }

            if (rootOffer.isRejected) {
                return res.status(400).json({ greska: `Ponuda sa id-em ${parentId} je odbijena` });
            }

            if (isRejected) {
                const relatedOffers = await rootOffer.getRelatedOffers();

                await Promise.all(
                    relatedOffers.map(async (offer) => {
                        offer.isRejected = true;
                        await offer.save();
                    })
                );
            }
        }

        await Offer.create({
            propertyId,
            userId: user.id,
            text,
            price,
            isRejected: parentId !== null ? isRejected : null,
            parentId
        });

        res.status(200).json({ poruka: 'Ponuda uspješno kreirana' });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};