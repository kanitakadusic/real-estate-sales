require('./config/database.js');

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;
const pug = require('pug');

const propertyController = require('./controllers/property.js');
const userController = require('./controllers/user.js');
const queryController = require('./controllers/query.js');
const requestController = require('./controllers/request.js');
const offerController = require('./controllers/offer.js');

const { readJsonFile, saveJsonFile } = require('./utils/file.js');

const PORT = 3001;
const app = express();

app.use(session({
    secret: 'l*3g29f!ek4$0=)2:Fd',
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
        const navigationHtml = pug.renderFile(path.join(__dirname, 'views', 'navigation.pug'), { userLoggedIn });
        
        const finalContent = content.replace('<!-- Navigation placeholder (DO NOT EDIT) -->', navigationHtml);

        res.send(finalContent);
    } catch (error) {
        console.error(`Error serving HTML file ${fileName}.html:`, error);
        res.status(500).json({ greska: 'Internal Server Error' });
    }
}

const routes = [
    { route: '/details.html', file: 'details.html', authRequired: false },
    { route: '/myQueries.html', file: 'myQueries.html', authRequired: true },
    { route: '/properties.html', file: 'properties.html', authRequired: false },
    { route: '/login.html', file: 'login.html', authRequired: false },
    { route: '/profile.html', file: 'profile.html', authRequired: true },
    { route: '/statistics.html', file: 'statistics.html', authRequired: false },
    { route: '/news.html', file: 'news.html', authRequired: false }
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
        res.redirect('/login.html');
    }
}

/* ----------- SERVING OTHER ROUTES --------------- */

// Verify user credentials and log the user in.
// Limit failed attempts to 3, with a 1-minute block.
// Log all login attempts.
app.post('/login', userController.userLogin);

// Delete all data from the session, effectively logging out the user.
app.post('/logout', userController.userLogout);

// Fetch details of the currently logged-in user.
app.get('/user', userController.getLoggedInUser);

// Update any field of the logged-in user's profile.
app.put('/user', userController.updateLoggedInUser);

// Fetch all properties in the system.
app.get('/properties', propertyController.getAllProperties);

// Fetch n most recently listed properties in the specified location.
app.get('/properties/top', propertyController.getTopPropertiesByLocation);

// Fetch details of the property with the given ID.
app.get('/properties/:id', propertyController.getPropertyById);

// Fetch interests { queries, requests, offers } for a given property.
app.get('/properties/:id/interests', propertyController.getPropertyInterests);

// Fetch all queries made by the logged-in user for properties.
app.get('/user/queries', queryController.getUserQueries);

// Create a new query for a property by a logged-in user.
// A user can make a maximum of 3 queries for each property.
app.post('/properties/:propertyId/query', queryController.createPropertyQuery);

// Fetch queries with pagination for the given property.
app.get('/properties/:propertyId/queries', queryController.getPropertyQueriesPaged);

// Create a new request for viewing a property by a logged-in user.
app.post('/properties/:propertyId/request', requestController.createPropertyRequest);

// Update the status of a request for property viewing by an admin.
app.put('/properties/:propertyId/requests/:requestId', requestController.updateRequestStatusByAdmin);

// Create a new price offer for a property by a logged-in user.
app.post('/properties/:propertyId/offer', offerController.createPropertyOffer);

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