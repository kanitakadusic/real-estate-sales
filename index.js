require('./config/database');

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;
const pug = require('pug');

const propertyController = require('./controllers/property.controller');
const userController = require('./controllers/user.controller');
const queryController = require('./controllers/query.controller');
const requestController = require('./controllers/request.controller');
const offerController = require('./controllers/offer.controller');

const { readJsonFile, saveJsonFile } = require('./utils/file.utils');

const PORT = 3000;
const app = express();

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

/*
Checks if the user exists and if the password is correct based on 'korisnici.json' data. 
If the data is correct, the username is saved in the session and a success message is sent.
User can make a maximum of 3 failed login attempts, otherwise he will be blocked for one minute.
Every login attempt is logged.
*/
app.post('/login', userController.userLogin);

/*
Delete everything from the session.
*/
app.post('/logout', userController.userLogout);

/*
Returns currently logged user data.
First takes the username from the session and grabs other data from the .json file.
*/
app.get('/korisnik', userController.getLoggedInUser);

/*
Updates any user field.
*/
app.put('/korisnik', userController.updateLoggedInUser);

/*
Returns all queries made by the logged-in user.
*/
app.get('/upiti/moji', queryController.getUserQueries);

/*
Allows logged user to make a request for a property.
User can make a maximum of 3 queries for one property.
*/
app.post('/upit', queryController.addUserQuery);

/*
Returns all properties from the file.
*/
app.get('/nekretnine', propertyController.getAllProperties);

/*
Returns the 5 most recently listed properties
located at the given location from the file 'nekretnine.json'.
*/
app.get('/nekretnine/top5', propertyController.getTopPropertiesByLocation);

/*
Returns details of property with specified ID in JSON format.
List of queries within the property is shortened to return only the last 3 queries.
*/
app.get('/nekretnina/:id', propertyController.getPropertyById);

/*
Returns the next 3 queries for the property based on the page number.
*/
app.get('/next/upiti/nekretnina/:id', queryController.getPropertyQueriesPaged);

// Fetch interests (queries, requests, offers) for a given property.
app.get('/nekretnina/:id/interesovanja', propertyController.getPropertyInterests);

// Create a new request for property viewing by a logged-in user.
app.post('/nekretnina/:id/zahtjev', requestController.createRequest);

// Update a request status for property viewing by an admin.
app.put('/nekretnina/:id/zahtjev/:zid', requestController.updateRequestStatusByAdmin);

/* ----------------- SERVING MARKETING ROUTES ----------------- */

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