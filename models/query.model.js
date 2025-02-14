module.exports = function (sequelize, DataTypes) {
    const Query = sequelize.define('Query', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        propertyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Property',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        text: {
            type: DataTypes.TEXT
        }
    }, {
        underscored: true
    });

    return Query;
};