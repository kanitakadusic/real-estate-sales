const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false
    }
);

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.User = require('../models/user.js')(sequelize, Sequelize.DataTypes);
database.Query = require('../models/query.js')(sequelize, Sequelize.DataTypes);
database.Request = require('../models/request.js')(sequelize, Sequelize.DataTypes);
database.Offer = require('../models/offer.js')(sequelize, Sequelize.DataTypes);
database.Property = require('../models/property.js')(sequelize, Sequelize.DataTypes);

require('../models/associations.js')(database);

async function initDatabase() {
    let isConnected = false;

    for (let i = 0; i < 10; i++) {
        try {
            await sequelize.authenticate();
            console.log('Successfully connected to the database');
            isConnected = true;
            break;
        } catch (_) {
            console.log('- database not ready, retrying...');
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    if (!isConnected) {
        console.error('Failed to connect to the database');
        process.exit(1);
    }

    await sequelize.sync({ force: false });
    console.log('Tables successfully synchronized');

    try {
        await insertTestData();
        console.log('Test data successfully inserted');
    } catch (_) {
        console.log('Test data already inserted');
    }
}

module.exports = { ...database, initDatabase };

async function insertTestData() {
    const { readJsonFile } = require('../utils/file.js');

    const users = await readJsonFile('users');
    for (const item of users) {
        await database.User.create(item);
    }

    const properties = await readJsonFile('properties');
    for (const item of properties) {
        await database.Property.create(item);
    }

    const queries = await readJsonFile('queries');
    for (const item of queries) {
        await database.Query.create(item);
    }

    const requests = await readJsonFile('requests');
    for (const item of requests) {
        await database.Request.create(item);
    }

    const offers = await readJsonFile('offers');
    for (const item of offers) {
        await database.Offer.create(item);
    }
}