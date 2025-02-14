const { User, Request, Property } = require('../config/database');

exports.createPropertyRequest = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { propertyId } = req.params;

    const { text, requestedDate } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        if (new Date(requestedDate) < new Date()) {
            return res.status(404).json({ greska: 'Traženi datum ne može biti raniji od trenutnog datuma' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        await Request.create({
            propertyId,
            userId: user.id,
            text,
            requestedDate
        });

        res.status(200).json({ poruka: 'Zahtjev uspješno kreiran' });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.updateRequestStatusByAdmin = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { propertyId, requestId } = req.params;

    const { isApproved, textAddition } = req.body;

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ greska: 'Zabranjen pristup' });
        }

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${propertyId} ne postoji` });
        }

        const request = await Request.findOne({ where: { id: requestId, propertyId } });
        if (!request) {
            return res.status(404).json({ greska: `Zahtjev sa id-em ${requestId} za nekretninu sa id-em ${propertyId} ne postoji` });
        }

        if (!isApproved && !textAddition) {
            return res.status(400).json({ greska: 'Mora postojati objašnjenje za neodobren zahtjev' });
        }

        if (textAddition) {
            request.text += `\nAdmin's response: ${textAddition}`;
        }

        request.isApproved = isApproved;

        await request.save();
        res.status(200).json({ poruka: 'Zahtjev je uspješno ažuriran.' });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};