const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Zahtjev', 
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
        trazeniDatum: {
            field: 'trazeniDatum',
            type: DataTypes.DATE,
            allowNull: false
        },
        odobren: {
            field: 'odobren',
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        tableName: 'Zahtjev',
    }
);

module.exports = Request;