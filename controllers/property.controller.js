const Property = require('../models/property.model');
const Query = require('../models/query.model');

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
    const { lokacija } = req.query;

    try {
        const properties = await Property.findAll({
            where: { lokacija: lokacija },
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
    const { id } = req.params;

    try {
        const property = await Property.findOne({
            where: { id: id },
            raw: true
        });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }

        const queries = await Query.findAll({
            where: { nekretnina_id: id },
            limit: 3,
            order: [['createdAt', 'DESC']],
            attributes: ['korisnik_id', 'tekst_upita'],
            raw: true
        });
        property.upiti = queries;

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};