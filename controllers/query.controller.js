const Property = require('../models/property.model');
const User = require('../models/user.model');
const Query = require('../models/query.model');

exports.getPropertyQueriesPaged = async (req, res) => {
    const { id } = req.params;
    const { page } = req.query;

    try {
        if (page < 0) {
            return res.status(404).json([]);
        }

        const property = await Property.findOne({ where: { id: id } });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }

        const queries = await Query.findAll({
            where: { nekretnina_id: id },
            limit: 3,
            offset: page * 3,
            order: [['createdAt', 'DESC']],
            attributes: ['korisnik_id', 'tekst_upita'],
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
            attributes: ['nekretnina_id', 'tekst_upita'],
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

exports.addUserQuery = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { nekretnina_id, tekst_upita } = req.body;

    try {
        const property = await Property.findOne({ where: { id: nekretnina_id } });
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        }

        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const queryCount = await Query.count({ where: { nekretnina_id: nekretnina_id, korisnik_id: user.id } });
        if (queryCount >= 3) {
            return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
        }

        await Query.create({
            nekretnina_id: nekretnina_id,
            korisnik_id: user.id,
            tekst_upita: tekst_upita
        });

        res.status(200).json({ poruka: 'Upit je uspješno dodan' });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};