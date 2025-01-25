const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wt24', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => {
        console.log('Successfully connected to the database');
        require('../models/associations');
        return sequelize.sync({ force: true });
    })
    .then(() => {
        console.log('Tables successfully synchronized');
        return insertTestData();
    })
    .catch((error) => {
        console.error('Error during database setup:', error);
    });

module.exports = sequelize;

async function insertTestData() {
    const { readJsonFile } = require('../utils/file.utils');

    const Property = require('../models/property.model');
    const User = require('../models/user.model');
    const Query = require('../models/query.model');
    const Request = require('../models/request.model');
    const Offer = require('../models/offer.model');

    try {
        const properties = await readJsonFile('properties.data');
        for (const property of properties) {
            await Property.create(property);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const users = await readJsonFile('users.data');       
        for (const user of users) {
            await User.create(user);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const queries = await readJsonFile('queries.data');
        for (const query of queries) {
            await Query.create(query);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const offers = await readJsonFile('offers.data');
        for (const offer of offers) {
            await Offer.create(offer);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log("Test data successfully inserted");
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};