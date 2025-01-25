const Property = require('../models/property.model');
const User = require('../models/user.model');
const Query = require('../models/query.model');
const Request = require('../models/request.model');
const Offer = require('../models/offer.model');

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
        const property = await Property.findOne({ where: { id: propertyId }, raw: true });
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

exports.getPropertyInterests = async (req, res) => {
    const propertyId = req.params.id;

    try {
        const property = await Property.findOne({ where: { id: propertyId } });
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await Query.findAll({ where: {nekretnina_id: propertyId}, raw: true });
        const requests = await Request.findAll({ where: {nekretnina_id: propertyId}, raw: true });
        const offers = await Offer.findAll({ where: {nekretnina_id: propertyId}, raw: true });

        res.status(200).json({ queries, requests, offers });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};