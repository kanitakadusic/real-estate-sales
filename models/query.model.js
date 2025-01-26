module.exports = function(sequelize, DataTypes) {
    const Query = sequelize.define('Upit', 
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
            }
        },
        {
            tableName: 'Upit'
        }
    );

    return Query;
};