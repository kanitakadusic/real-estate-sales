const { User, Query, Property } = require('../config/database.js');
const locale = require('../locales/en.json');

exports.getPropertyQueriesPaged = async (req, res) => {
    const { propertyId } = req.params;
    
    const { page } = req.query;

    try {
        if (isNaN(page) || page < 0) {
            return res.status(400).json({ message: locale['400'] });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
        }

        const queries = await property.getQueries({
            limit: 3,
            offset: page * 3,
            order: [['createdAt', 'DESC']],
            attributes: ['userId', 'text'],
            raw: true
        });

        res.status(200).json({
            message: locale['200'],
            data: queries
        });
    } catch (error) {
        console.error('Error fetching queries for property:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.getUserQueries = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }

        const queries = await user.getQueries({
            attributes: ['propertyId', 'text'],
            raw: true
        });

        res.status(200).json({
            message: locale['200'],
            data: queries
        });
    } catch (error) {
        console.error('Error fetching user queries:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.createPropertyQuery = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    const { propertyId } = req.params;

    const { text } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
        }

        if (typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ message: locale['400'] });
        }

        const queryCount = await Query.count({ where: { propertyId, userId: user.id } });
        if (queryCount >= 3) {
            return res.status(409).json({ message: locale['409'] });
        }

        await Query.create({
            propertyId,
            userId: user.id,
            text
        });

        res.status(201).json({ message: locale['201'] });
    } catch (error) {
        console.error('Error creating query:', error);
        res.status(500).json({ message: locale['500'] });
    }
};