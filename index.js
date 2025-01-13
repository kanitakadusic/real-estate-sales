const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const pug = require('pug');

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'tajna sifra',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.set('view engine', 'pug');

/* ---------------- SERVING HTML -------------------- */

async function serveHTMLFile(req, res, fileName) {
    const htmlPath = path.join(__dirname, 'public/html', fileName);
    try {
        const content = await fs.readFile(htmlPath, 'utf-8');

        const userLoggedIn = req.session.username ? true : false;
        const navigationHtml = pug.renderFile(path.join(__dirname, 'views', 'meni.pug'), { userLoggedIn });
        
        const finalContent = content.replace('<!-- Navigation placeholder (DO NOT EDIT) -->', navigationHtml);

        res.send(finalContent);
    } catch (error) {
        console.error(`Error serving HTML file ${fileName}.html:`, error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
}

const routes = [
    { route: '/detalji.html', file: 'detalji.html', authRequired: false },
    { route: '/mojiUpiti.html', file: 'mojiUpiti.html', authRequired: true },
    { route: '/nekretnine.html', file: 'nekretnine.html', authRequired: false },
    { route: '/prijava.html', file: 'prijava.html', authRequired: false },
    { route: '/profil.html', file: 'profil.html', authRequired: true },
    { route: '/statistika.html', file: 'statistika.html', authRequired: false },
    { route: '/vijesti.html', file: 'vijesti.html', authRequired: false }
];

routes.forEach(({ route, file, authRequired }) => {
    if (authRequired) {
        app.get(route, isAuthenticated, async (req, res) => {
            await serveHTMLFile(req, res, file);
        });
    } else {
        app.get(route, async (req, res) => {
            await serveHTMLFile(req, res, file);
        });
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        return next();
    } else {
        res.redirect('/prijava.html');
    }
}

/* ----------- SERVING OTHER ROUTES --------------- */

// Async function for reading json data from 'data' folder
async function readJsonFile(fileName) {
    const filePath = path.join(__dirname, 'data', `${fileName}.json`);
    try {
        const rawdata = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(rawdata);
    } catch (error) {
        console.error(`Error reading JSON file ${fileName}.json:`, error);
        throw error;
    }
}

// Async function for saving json data in 'data' folder
async function saveJsonFile(fileName, data) {
    const filePath = path.join(__dirname, 'data', `${fileName}.json`);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing JSON file ${fileName}.json:`, error);
        throw error;
    }
}

// Async function for adding data in txt file in 'logs' folder
async function addInTxtFile(fileName, data) {
    const filePath = path.join(__dirname, 'logs', `${fileName}.txt`);
    try {
        await fs.appendFile(filePath, data, 'utf-8');
    } catch (error) {
        console.error(`Error appending TXT file ${fileName}.txt:`, error);
        throw error;
    }
}

/*
Logs user's login attempt with timestamp, username and status
into 'prijave.txt' file in 'logs' folder.
*/
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

/*
Checks if the user exists and if the password is correct based on 'korisnici.json' data. 
If the data is correct, the username is saved in the session and a success message is sent.
User can make a maximum of 3 failed login attempts, otherwise he will be blocked for one minute.
Every login attempt is logged.
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await readJsonFile('korisnici');

        for (let user of users) {
            if (user.username == username) {

                if (user.loginAttempts >= 3) {
                    if (new Date() < new Date(user.blockedUntil)) {
                        await logLoginAttempt(user.username, false);

                        return res.status(429).json({
                            greska: 'Previše neuspješnih pokušaja. Pokušajte ponovo za 1 minutu.'
                        });
                    } else {
                        user.loginAttempts = 0;
                        user.blockedUntil = null;
                    }
                }

                const isPasswordMatched = await bcrypt.compare(password, user.password);

                if (isPasswordMatched) {
                    req.session.username = user.username;
                    user.loginAttempts = 0;

                    res.json({ poruka: 'Uspješna prijava' });
                } else {
                    if (++(user.loginAttempts) >= 3) {
                        user.blockedUntil = new Date(new Date().getTime() + 1 * 60 * 1000);
                    }

                    res.json({ poruka: 'Neuspješna prijava' });
                }

                await logLoginAttempt(user.username, isPasswordMatched);
                await saveJsonFile('korisnici', users);
                return;
            }
        }
        
        await logLoginAttempt(username, false);

        res.json({ poruka: 'Neuspješna prijava' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
});

/*
Delete everything from the session.
*/
app.post('/logout', (req, res) => {
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
});

/*
Returns currently logged user data.
First takes the username from the session and grabs other data from the .json file.
*/
app.get('/korisnik', async (req, res) => {
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
});

/*
Allows logged user to make a request for a property.
User can make a maximum of 3 queries for one property.
*/
app.post('/upit', async (req, res) => {
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
            return res.status(429).json({ greska: 'Previše upita za istu nekretninu.' });
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
});

/*
Updates any user field.
*/
app.put('/korisnik', async (req, res) => {
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
});

/*
Returns all properties from the file.
*/
app.get('/nekretnine', async (req, res) => {
    try {
        const nekretnineData = await readJsonFile('nekretnine');
        res.json(nekretnineData);
    } catch (error) {
        console.error('Error fetching properties data:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
});

// Function for parsing a date in the "DD.MM.YYYY." format.
function parseDate(date) {
    const [day, month, year] = date.trim().split('.');

    if (!day || !month || !year) {
        throw new Error('Invalid date format');
    }

    return new Date(`${year.trim()}-${month.trim()}-${day.trim()}`);
}

/*
Returns the 5 most recently listed properties
located at the given location from the file 'nekretnine.json'.
*/
app.get('/nekretnine/top5', async (req, res) => {
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
});

/*
Returns all queries made by the logged-in user.
*/
app.get('/upiti/moji', async (req, res) => {
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
});

/*
Returns details of property with specified ID in JSON format.
List of queries within the property is shortened to return only the last 3 queries.
*/
app.get('/nekretnina/:id', async (req, res) => {
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
});

/*
Returns the next 3 queries for the property based on the page number.
*/
app.get('/next/upiti/nekretnina/:id', async (req, res) => {
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

        const endIndex = -page * 3;
        const nextQueries = property.upiti.slice(endIndex - 3, endIndex);

        if (nextQueries.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(nextQueries.reverse());
    } catch (error) {
        console.error('Error fetching next queries for property:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
});

/* ----------------- MARKETING ROUTES ----------------- */

/*
Increases the number of searches for each of the properties by one.
*/
app.post('/marketing/nekretnine', async (req, res) => {
    const { propertyIDsList } = req.body;

    try {
        let preferences = await readJsonFile('preferencije');

        if (!preferences || !Array.isArray(preferences)) {
            console.error('Neispravan format podataka u \'preferencije.json\'');
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        preferences = preferences.map((preference) => {
            preference.pretrage = preference.pretrage || 0;
            return preference;
        });

        propertyIDsList.forEach((id) => {
            const preference = preferences.find((p) => p.id === id);
            if (preference) preference.pretrage += 1;
        });

        await saveJsonFile('preferencije', preferences);
        res.status(200).json({});
    } catch (error) {
        console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*
Increases a property's click count by one.
*/
app.post('/marketing/nekretnina/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const preferences = await readJsonFile('preferencije');
        const preference = preferences.find((p) => p.id === parseInt(id, 10));

        if (preference) {
            preference.klikovi = (preference.klikovi || 0) + 1;

            await saveJsonFile('preferencije', preferences);
            res.status(200).json({ success: true, message: 'Broj klikova ažuriran' });
        } else {
            res.status(404).json({ error: 'Nekretnina nije pronađena' });
        }
    } catch (error) {
        console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*
Updates the number of searches.
*/
app.post('/marketing/osvjezi/pretrage', async (req, res) => {
    const { propertyIDsList } = req.body || { propertyIDsList: [] };

    try {
        const preferences = await readJsonFile('preferencije');

        const newSearches = propertyIDsList.map((id) => {
            const preference = preferences.find((p) => p.id === id);

            return {
                id: id,
                searches: preference ? preference.pretrage : 0
            };
        });

        res.status(200).json({ preferenceList: newSearches });
    } catch (error) {
        console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/*
Updates the number of clicks.
*/
app.post('/marketing/osvjezi/klikovi', async (req, res) => {
    const { propertyIDsList } = req.body || { propertyIDsList: [] };

    try {
        const preferences = await readJsonFile('preferencije');

        const newClicks = propertyIDsList.map((id) => {
            const preference = preferences.find((p) => p.id === id);

            return {
                id: id,
                clicks: preference ? preference.klikovi : 0
            };
        });

        res.status(200).json({ preferenceList: newClicks });
    } catch (error) {
        console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});