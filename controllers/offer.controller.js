const { User, Offer, Property } = require('../config/database');

exports.createPropertyOffer = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const propertyId = req.params.id;

    const offerText = req.body.tekst;
    const offerPrice = req.body.ponudaCijene;
    const offerDate = req.body.datumPonude;
    const isOfferRejected = req.body.odbijenaPonuda;
    const parentOfferId = req.body.idVezanePonude;

    if (!offerPrice && !isOfferRejected) {
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

        if (parentOfferId !== null) {
            const parentOffer = await Offer.findByPk(parentOfferId);
            if (!parentOffer) {
                return res.status(404).json({ greska: `Ponuda sa id-em ${parentOfferId} ne postoji` });
            }

            const rootOffer = await parentOffer.getRootOffer();

            if (!user.admin && user.id != rootOffer.korisnik_id) {
                return res.status(403).json({ greska: 'Zabranjen pristup' });
            }

            if (propertyId != rootOffer.nekretnina_id) {
                return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} nema ponudu sa id-em ${parentOfferId}` });
            }

            if (rootOffer.odbijenaPonuda) {
                return res.status(400).json({ greska: `Ponuda sa id-em ${parentOfferId} je odbijena` });
            }

            if (isOfferRejected) {
                const relatedOffers = await rootOffer.vezanePonude;

                await Promise.all(
                    relatedOffers.map(async (offer) => {
                        offer.odbijenaPonuda = true;
                        await offer.save();
                    })
                );
            }
        }

        await Offer.create({
            nekretnina_id: propertyId,
            korisnik_id: user.id,
            tekst: offerText,
            cijenaPonude: offerPrice,
            datumPonude: offerDate,
            odbijenaPonuda: parentOfferId !== null ? isOfferRejected : null,
            parentOfferId: parentOfferId
        });

        res.status(200).json({ poruka: 'Ponuda uspješno kreirana' });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};