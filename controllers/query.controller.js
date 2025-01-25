const Property = require('../models/property.model');
const User = require('../models/user.model');
const Query = require('../models/query.model');

exports.getPropertyQueriesPaged = async (req, res) => {
    const propertyId = req.params.id;
    
    const page = req.query.page;

    try {
        if (page < 0) {
            return res.status(404).json([]);
        }

        const property = await Property.findOne({ where: { id: propertyId } });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await Query.findAll({
            where: { nekretnina_id: propertyId },
            limit: 3,
            offset: page * 3,
            order: [['createdAt', 'DESC']],
            attributes: ['korisnik_id', 'tekst'],
            raw: true
        });

        if (queries.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(queries);
    } catch (error) {
        console.error('Error fetching next queries for property:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getUserQueries = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    try {
        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const queries = await Query.findAll({
            where: { korisnik_id: user.id },
            attributes: ['nekretnina_id', 'tekst'],
            raw: true
        });
        
        if (queries.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(queries);
    } catch (error) {
        console.error('Error fetching user queries:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.createUserQuery = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const propertyId = req.body.nekretnina_id;
    const queryText = req.body.tekst_upita;

    try {
        const property = await Property.findOne({ where: { id: propertyId } });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const queryCount = await Query.count({ where: { nekretnina_id: propertyId, korisnik_id: user.id } });
        if (queryCount >= 3) {
            return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
        }

        await Query.create({
            nekretnina_id: propertyId,
            korisnik_id: user.id,
            tekst: queryText
        });

        res.status(200).json({ poruka: 'Upit je uspješno dodan' });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};