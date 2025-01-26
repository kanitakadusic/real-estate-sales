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

    try {
        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const property = await Property.findOne({ where: { id: propertyId } });
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        if (parentOfferId !== null) {
            const offers = await Offer.findAll();

            const rootOffer = Offer.rootOffer(offers, parentOfferId);
            if (!rootOffer) {
                return res.status(404).json({ greska: `Ponuda sa id-em ${parentOfferId} ne postoji` });
            }

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
                const relatedOffers = Offer.childOffers(offers, rootOffer.id);
                relatedOffers.push(rootOffer);

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