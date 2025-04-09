const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('real_estate', 'root', 'password', {
    host: 'mysql-db',
    dialect: 'mysql',
    port: 3306,
    logging: false
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.User = require('../models/user.js')(sequelize, Sequelize.DataTypes);
database.Query = require('../models/query.js')(sequelize, Sequelize.DataTypes);
database.Request = require('../models/request.js')(sequelize, Sequelize.DataTypes);
database.Offer = require('../models/offer.js')(sequelize, Sequelize.DataTypes);
database.Property = require('../models/property.js')(sequelize, Sequelize.DataTypes);

require('../models/associations.js')(database);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the database');

        await sequelize.sync({ force: false });
        console.log('Tables successfully synchronized');

        try {
            await insertTestData();
            console.log('Test data successfully inserted');
        } catch (_) {
            console.log('Test data already inserted');
        }
    } catch (error) {
        console.error('Error during database setup:', error);
    }
})();

module.exports = database;

async function insertTestData() {
    const { readJsonFile } = require('../utils/file.js');

    const insertWithDelay = async (model, data) => {
        for (const item of data) {
            await model.create(item);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    const users = await readJsonFile('users');
    await insertWithDelay(database.User, users);

    const properties = await readJsonFile('properties');
    await insertWithDelay(database.Property, properties);

    const queries = await readJsonFile('queries');
    await insertWithDelay(database.Query, queries);

    const requests = await readJsonFile('requests');
    await insertWithDelay(database.Request, requests);

    const offers = await readJsonFile('offers');
    await insertWithDelay(database.Offer, offers);
}