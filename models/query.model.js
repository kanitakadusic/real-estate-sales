const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Query = sequelize.define('Upit', 
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
        tekst_upita: {
            field: 'tekst_upita',
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'Upit',
    }
);

module.exports = Query;