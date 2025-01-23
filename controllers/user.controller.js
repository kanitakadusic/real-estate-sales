const bcrypt = require('bcrypt');
const { readJsonFile, saveJsonFile, addInTxtFile } = require('../utils/file.utils');

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await readJsonFile('korisnici');
        const user = users.find((u) => u.username === username);

        if (user) {            
            if (!req.session.loginAttempts) req.session.loginAttempts = 0;
            if (!req.session.blockedUntil) req.session.blockedUntil = null;
            
            if (req.session.blockedUntil) {
                if (new Date() < new Date(req.session.blockedUntil)) {
                    await logLoginAttempt(username, false);
                    return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.' });
                } else {
                    req.session.loginAttempts = 0;
                    req.session.blockedUntil = null;
                }
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (isPasswordMatched) {
                req.session.username = username;
                req.session.loginAttempts = 0;
                await logLoginAttempt(username, true);
                return res.status(200).json({ poruka: 'Uspješna prijava' });
            }

            if (++(req.session.loginAttempts) >= 3) {
                req.session.blockedUntil = new Date(new Date().getTime() + 1 * 60 * 1000);
            }
        }

        await logLoginAttempt(username, false);
        res.status(200).json({ poruka: 'Neuspješna prijava' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.userLogout = (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ greska: 'Internal Server Error' });
        } else {
            res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
        }
    });
};

exports.getUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    try {
        const users = await readJsonFile('korisnici');
        const user = users.find((u) => u.username === req.session.username);

        if (!user) {
            // User not found (should not happen if users are correctly managed)
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const userPublicData = {
            id: user.id,
            ime: user.ime,
            prezime: user.prezime,
            username: user.username
        };

        res.status(200).json(userPublicData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.setUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { ime, prezime, username, password } = req.body;

    try {
        const users = await readJsonFile('korisnici');
        const user = users.find((u) => u.username === req.session.username);

        if (!user) {
            // User not found (should not happen if users are correctly managed)
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        if (ime) user.ime = ime;
        if (prezime) user.prezime = prezime;
        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await saveJsonFile('korisnici', users);
        res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.getQueries = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    try {
        const users = await readJsonFile('korisnici');
        const user = users.find((u) => u.username === req.session.username);

        const properties = await readJsonFile('nekretnine');
        const userQueries = [];

        properties.forEach((property) => {
            property.upiti.forEach((query) => {
                if (query.korisnik_id === user.id) {
                    userQueries.push({
                        id_nekretnine: property.id,
                        tekst_upita: query.tekst_upita
                    });
                }
            });
        });

        if (userQueries.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(userQueries);
    } catch (error) {
        console.error('Error fetching user queries:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.addQuery = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const { nekretnina_id, tekst_upita } = req.body;

    try {
        const users = await readJsonFile('korisnici');
        const user = users.find((u) => u.username === req.session.username);

        const properties = await readJsonFile('nekretnine');
        const property = properties.find((p) => p.id === nekretnina_id);

        if (!property) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        }

        const userQueries = property.upiti.filter((q) => q.korisnik_id === user.id);
        if (userQueries.length >= 3) {
            return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
        }

        property.upiti.push({
            korisnik_id: user.id,
            tekst_upita: tekst_upita
        });
        
        await saveJsonFile('nekretnine', properties);
        res.status(200).json({ poruka: 'Upit je uspješno dodan' });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

async function logLoginAttempt(username, success) {
    const currently = new Date().toISOString();
    const status = success ? 'uspješno' : 'neuspješno';
    const log = `[${currently}]-username:\"${username}\"-status:\"${status}\"\n`;
    try {
        await addInTxtFile('prijave', log);
    } catch (error) {
        console.error(`Error logging login attempt for ${username}:`, error);
        throw error;
    }
}