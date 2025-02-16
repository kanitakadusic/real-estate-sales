const { User, Request, Property } = require('../config/database.js');
const locale = require('../locales/en.json');

exports.createPropertyRequest = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    const { propertyId } = req.params;

    const { text, requestedDate } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ message: locale['404'] });
        }
        
        if (!requestedDate || isNaN(Date.parse(requestedDate)) || new Date(requestedDate) < new Date()) {
            return res.status(400).json({ message: locale['400'] });
        }

        await Request.create({
            propertyId,
            userId: user.id,
            text,
            requestedDate
        });

        res.status(201).json({ message: locale['201'] });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.updateRequestStatusByAdmin = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    const { propertyId, requestId } = req.params;

    const { isApproved, textAddition } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ message: locale['403'] });
        }

        const request = await Request.findOne({ where: { id: requestId, propertyId } });
        if (!request) {
            return res.status(404).json({ message: locale['404'] });
        }

        if (!isApproved && (typeof textAddition !== 'string' || !textAddition.trim())) {
            return res.status(400).json({ message: locale['400'] });
        }

        if (textAddition) {
            request.text += `\nAdmin's response: ${textAddition}`;
        }

        request.isApproved = isApproved;

        await request.save();
        res.status(200).json({ message: locale['200'] });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ message: locale['500'] });
    }
};