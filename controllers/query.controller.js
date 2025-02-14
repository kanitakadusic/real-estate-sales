const { User, Query, Property } = require('../config/database');

exports.getPropertyQueriesPaged = async (req, res) => {
    const { propertyId } = req.params;
    
    const { page } = req.query;

    try {
        if (page < 0) {
            return res.status(404).json([]);
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const queries = await property.getQueries({
            limit: 3,
            offset: page * 3,
            order: [['createdAt', 'DESC']],
            attributes: ['userId', 'text'],
            raw: true
        });

        if (!queries.length) {
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
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const queries = await user.getQueries({
            attributes: ['propertyId', 'text'],
            raw: true
        });
        
        if (!queries.length) {
            return res.status(404).json([]);
        }

        res.status(200).json(queries);
    } catch (error) {
        console.error('Error fetching user queries:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.createPropertyQuery = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { propertyId } = req.params;

    const { text } = req.body;

    try {
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const queryCount = await Query.count({ where: { propertyId, userId: user.id } });
        if (queryCount >= 3) {
            return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
        }

        await Query.create({
            propertyId,
            userId: user.id,
            text
        });

        res.status(200).json({ poruka: 'Upit je uspješno dodan' });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};