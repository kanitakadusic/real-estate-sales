const Property = require('../models/property.model');
const User = require('../models/user.model');
const Request = require('../models/request.model');

exports.createRequest = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { id } = req.params;
    const { tekst, trazeniDatum } = req.body;

    try {
        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        if (new Date(trazeniDatum) < new Date()) {
            return res.status(404).json({ greska: 'Traženi datum ne može biti raniji od trenutnog datuma' });
        }

        const property = await Property.findOne({ where: { id: id } });
        if (!property) {
            return res.status(404).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }

        await Request.create({
            nekretnina_id: id,
            korisnik_id: user.id,
            tekst: tekst,
            trazeniDatum: trazeniDatum
        });

        res.status(200).json({ poruka: 'Zahtjev za pregled nekretnine uspješno kreiran' });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};