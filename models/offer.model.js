const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Ponuda', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nekretnina_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Nekretnina',
                key: 'id'
            }
        },
        korisnik_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Korisnik',
                key: 'id'
            }
        },
        tekst: {
            type: DataTypes.TEXT
        },
        cijenaPonude: {
            type: DataTypes.FLOAT
        },
        datumPonude: {
            type: DataTypes.DATE
        },
        odbijenaPonuda: {
            type: DataTypes.BOOLEAN
        },
        parentOfferId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Ponuda',
                key: 'id'
            }
        }
    },
    {
        tableName: 'Ponuda',
    }
);

module.exports = Offer;