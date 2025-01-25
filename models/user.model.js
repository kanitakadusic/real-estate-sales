const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Korisnik',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prezime: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    },
    {
        tableName: 'Korisnik'
    }
);

module.exports = User;