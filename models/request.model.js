module.exports = function(sequelize, DataTypes) {
    const Request = sequelize.define('Zahtjev', 
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
            trazeniDatum: {
                type: DataTypes.DATE
            },
            odobren: {
                type: DataTypes.BOOLEAN
            }
        },
        {
            tableName: 'Zahtjev'
        }
    );

    return Request;
};