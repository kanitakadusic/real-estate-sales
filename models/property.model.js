const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Query = require('./query.model');
const Request = require('./request.model');
const Offer = require('./offer.model');

const Property = sequelize.define('Nekretnina', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tip_nekretnine: {
            type: DataTypes.STRING
        },
        naziv: {
            type: DataTypes.STRING
        },
        kvadratura: {
            type: DataTypes.INTEGER
        },
        cijena: {
            type: DataTypes.FLOAT
        },
        tip_grijanja: {
            type: DataTypes.STRING
        },
        lokacija: {
            type: DataTypes.STRING
        },
        godina_izgradnje: {
            type: DataTypes.INTEGER
        },
        datum_objave: {
            type: DataTypes.DATE
        },
        opis: {
            type: DataTypes.TEXT
        },
    },
    {
        tableName: 'Nekretnina'
    }
);

Property.prototype.getInteresovanja = async function () {
    const queries = await Query.findAll();
    const requests = await Request.findAll();
    const offers = await Offer.findAll();

    return [...queries, ...requests, ...offers];
};

module.exports = Property;