const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { addInTxtFile } = require('../utils/file.utils');

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

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

exports.getLoggedInUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    try {
        const user = await User.findOne({ where: { username: req.session.username } });
        if (!user) {
            return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        const userPublicData = {
            id: user.id,
            ime: user.ime,
            prezime: user.prezime,
            username: user.username,
            admin: user.admin
        };

        res.status(200).json(userPublicData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
};

exports.updateLoggedInUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const firstname = req.body.ime;
    const lastname = req.body.prezime;
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = {};

        if (firstname) user.ime = firstname;
        if (lastname) user.prezime = lastname;
        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        const [updated] = await User.update(user, { where: { username: req.session.username } });

        if (updated > 0) {
            if (username) req.session.username = username;
            res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
        } else {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
        }
    } catch (error) {
        console.error('Error updating user data:', error);
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