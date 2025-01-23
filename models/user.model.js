const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Korisnik',
    {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ime: {
            field: 'ime',
            type: DataTypes.STRING,
            allowNull: false,
        },
        prezime: {
            field: 'prezime',
            type: DataTypes.STRING,
        },
        username: {
            field: 'username',
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            field: 'password',
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin: {
            field: 'admin',
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