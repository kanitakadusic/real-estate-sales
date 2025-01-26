const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wt24', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.User = require('../models/user.model')(sequelize, Sequelize.DataTypes);
database.Query = require('../models/query.model')(sequelize, Sequelize.DataTypes);
database.Request = require('../models/request.model')(sequelize, Sequelize.DataTypes);
database.Offer = require('../models/offer.model')(sequelize, Sequelize.DataTypes);
database.Property = require('../models/property.model')(sequelize, Sequelize.DataTypes);

require('../models/associations')(database);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the database');

        await sequelize.sync({ force: true });
        console.log('Tables successfully synchronized');

        await insertTestData();
    } catch (error) {
        console.error('Error during database setup:', error);
    }
})();

module.exports = database;

async function insertTestData() {
    const { readJsonFile } = require('../utils/file.utils');

    const insertWithDelay = async (model, data) => {
        for (const item of data) {
            await model.create(item);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    try {
        const users = await readJsonFile('users.data');
        await insertWithDelay(database.User, users);

        const properties = await readJsonFile('properties.data');
        await insertWithDelay(database.Property, properties);

        const queries = await readJsonFile('queries.data');
        await insertWithDelay(database.Query, queries);

        const requests = await readJsonFile('requests.data');
        await insertWithDelay(database.Request, requests);

        const offers = await readJsonFile('offers.data');
        await insertWithDelay(database.Offer, offers);

        console.log("Test data successfully inserted");
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
}