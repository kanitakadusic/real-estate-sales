module.exports = function (sequelize, DataTypes) {
    const Request = sequelize.define('Request', {
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
        },
        requestedDate: {
            type: DataTypes.DATE
        },
        isApproved: {
            type: DataTypes.BOOLEAN

        }
    }, {
        underscored: true
    });

    return Request;
};