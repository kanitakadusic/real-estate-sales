const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Nekretnina', 
    {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tip_nekretnine: {
            field: 'tip_nekretnine',
            type: DataTypes.STRING,
            allowNull: false,
        },
        naziv: {
            field: 'naziv',
            type: DataTypes.STRING,
            allowNull: false,
        },
        kvadratura: {
            field: 'kvadratura',
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cijena: {
            field: 'cijena',
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tip_grijanja: {
            field: 'tip_grijanja',
            type: DataTypes.STRING
        },
        lokacija: {
            field: 'lokacija',
            type: DataTypes.STRING
        },
        godina_izgradnje: {
            field: 'godina_izgradnje',
            type: DataTypes.INTEGER
        },
        datum_objave: {
            field: 'datum_objave',
            type: DataTypes.STRING
        },
        opis: {
            field: 'opis',
            type: DataTypes.TEXT
        },
    },
    {
        tableName: 'Nekretnina',
    }
);

module.exports = Property;