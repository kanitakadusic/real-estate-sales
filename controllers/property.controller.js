const { readJsonFile } = require('../utils/file.utils');

exports.getProperties = async (req, res) => {
    try {
        const properties = await readJsonFile('nekretnine');
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getTopProperties = async (req, res) => {
    const { lokacija } = req.query;

    try {
        const properties = await readJsonFile('nekretnine');

        const processedProperties = properties
            .filter((p) => p.lokacija === lokacija)
            .sort((a, b) => parseDate(b.datum_objave) - parseDate(a.datum_objave))
            .slice(0, 5);

        res.status(200).json(processedProperties);
    } catch (error) {
        console.error('Error fetching top 5 properties:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const properties = await readJsonFile('nekretnine');
        const property = properties.find((p) => p.id === Number(id));

        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }
        
        property.upiti = property.upiti.slice(-3).reverse();

        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getQueries = async (req, res) => {
    const { id } = req.params;
    const { page } = req.query;

    if (page < 0) {
        return res.status(404).json([]);
    }

    try {
        const properties = await readJsonFile('nekretnine');
        const property = properties.find((p) => p.id === Number(id));

        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }

        let nextQueries = [];
        if (page == 0) {
            nextQueries = property.upiti.slice(-3);
        } else {
            const endIndex = -page * 3;
            nextQueries = property.upiti.slice(endIndex - 3, endIndex);
        }

        if (nextQueries.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(nextQueries.reverse());
    } catch (error) {
        console.error('Error fetching next queries for property:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

function parseDate(date) {
    const [day, month, year] = date.trim().split('.');

    if (!day || !month || !year) {
        throw new Error('Invalid date format');
    }

    return new Date(`${year.trim()}-${month.trim()}-${day.trim()}`);
}