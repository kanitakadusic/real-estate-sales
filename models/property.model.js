const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Property;