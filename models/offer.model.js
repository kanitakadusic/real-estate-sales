const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Ponuda', 
    {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nekretnina_id: {
            field: 'nekretnina_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Nekretnina',
                key: 'id'
            }
        },
        korisnik_id: {
            field: 'korisnik_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Korisnik',
                key: 'id'
            }
        },
        tekst: {
            field: 'tekst',
            type: DataTypes.TEXT
        },
        cijenaPonude: {
            field: 'cijenaPonude',
            type: DataTypes.FLOAT,
            allowNull: false
        },
        datumPonude: {
            field: 'datumPonude',
            type: DataTypes.DATE,
            allowNull: false
        },
        odbijenaPonuda: {
            field: 'odbijenaPonuda',
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        vezanePonude: {
            field: 'vezanePonude',
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