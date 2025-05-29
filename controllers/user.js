const { User } = require('../config/database.js');
const bcrypt = require('bcrypt');
const { addInTxtFile } = require('../utils/file.js');
const locale = require('../locales/en.json');

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);

        if (user) {
            if (!req.session.loginAttempts) req.session.loginAttempts = 0;
            if (!req.session.blockedUntil) req.session.blockedUntil = null;
            
            if (req.session.blockedUntil) {
                if (new Date() < new Date(req.session.blockedUntil)) {
                    await logLoginAttempt(username, false);
                    return res.status(429).json({ message: locale['429'] });
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
                return res.status(200).json({ message: locale['200'] });
            }

            if (++(req.session.loginAttempts) >= 3) {
                req.session.blockedUntil = new Date(new Date().getTime() + 1 * 60 * 1000);
            }
        }

        await logLoginAttempt(username, false);
        res.status(401).json({ message: locale['401'] });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.userLogout = (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ message: locale['500'] });
        } else {
            res.status(200).json({ message: locale['200'] });
        }
    });
};

exports.getLoggedInUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    try {
        const user = await User.findByUsername(req.session.username);
        if (!user) {
            return res.status(401).json({ message: locale['401'] });
        }

        const userPublicData = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            isAdmin: user.isAdmin
        };

        res.status(200).json({
            message: locale['200'],
            data: userPublicData
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

exports.updateLoggedInUser = async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: locale['401'] });
    }

    const { firstname, lastname, username, password } = req.body;

    try {
        const user = {};

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        
        await User.update(user, { where: { username: req.session.username } });
        if (username) req.session.username = username;
        
        res.status(200).json({ message: locale['200'] });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: locale['500'] });
    }
};

async function logLoginAttempt(username, success) {
    const currently = new Date().toISOString();
    const log = `[${currently}]-username:\'${username}\'-success:\'${success}\'\n`;
    try {
        await addInTxtFile('logins', log);
    } catch (error) {
        console.error(`Error logging login attempt for ${username}:`, error);
        throw error;
    }
}