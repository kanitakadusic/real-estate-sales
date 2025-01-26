const { User, Query, Request, Offer, Property } = require('../config/database');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({ raw: true });

        if (properties.length === 0) {
            return res.status(404).json({ greska: 'Nema nekretnina' });
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getTopPropertiesByLocation = async (req, res) => {
    const propertyLocation = req.query.lokacija;

    try {
        const properties = await Property.findAll({
            where: { lokacija: propertyLocation },
            limit: 5,
            order: [['datum_objave', 'DESC']],
            raw: true
        });

        if (properties.length === 0) {
            return res.status(404).json({ greska: 'Nema nekretnina' });
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching top 5 properties:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getPropertyById = async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findByPk(propertyId, { raw: true });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await Query.findAll({
            where: { nekretnina_id: propertyId },
            limit: 3,
            order: [['createdAt', 'DESC']],
            attributes: ['korisnik_id', 'tekst'],
            raw: true
        });
        
        property.upiti = queries;

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getPropertyInterestsAsArray = async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await property.getQueries();
        const requests = await property.getRequests();
        const offers = await property.getOffers();

        if (req.session.username) {
            const user = await User.findByUsername(req.session.username);
            if (user) {
                if (!user.admin) {
                    for (const offer of offers) {
                        const rootOffer = await offer.getRootOffer();

                        if (rootOffer.korisnik_id != user.id) {
                            offer.cijenaPonude = undefined;
                        }
                    }
                }

                return res.status(200).json([...queries, ...requests, ...offers]);
            }
        }

        for (const offer of offers) {
            offer.cijenaPonude = undefined;
        }

        res.status(200).json([...queries, ...requests, ...offers]);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getPropertyInterestsAsObject = async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await property.getQueries({ attributes: ['id', 'tekst'] });

        if (req.session.username) {
            const user = await User.findByUsername(req.session.username);
            if (user) {
                let requests = [];
                let offers = [];

                if (!user.admin) {
                    requests = await property.getRequests({
                        where: { korisnik_id: user.id },
                        attributes: ['id', 'tekst', 'trazeniDatum', 'odobren']
                    });
                    offers = await property.getOffers({
                        attributes: {
                            exclude: ['nekretnina_id', 'datumPonude', 'createdAt', 'updatedAt']
                        }
                    });

                    for (const offer of offers) {
                        const rootOffer = await offer.getRootOffer();

                        if (rootOffer.korisnik_id != user.id) {
                            offer.cijenaPonude = undefined;
                        }

                        offer.korisnik_id = undefined;
                        offer.parentOfferId = undefined;
                    }
                } else {
                    requests = await property.getRequests({
                        attributes: ['id', 'tekst', 'trazeniDatum', 'odobren']
                    });
                    offers = await property.getOffers({
                        attributes: ['id', 'tekst', 'cijenaPonude', 'odbijenaPonuda']
                    });
                }

                return res.status(200).json({ queries, requests, offers });
            }
        }

        const offers = await property.getOffers({ attributes: ['id', 'tekst', 'odbijenaPonuda'] });

        res.status(200).json({ queries, requests: [], offers });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};