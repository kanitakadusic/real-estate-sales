module.exports = function (database) {
    const { User, Query, Request, Offer, Property } = database;

    // QUERY
    Query.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
    Property.hasMany(Query, { foreignKey: 'property_id', as: 'queries' });

    Query.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Query, { foreignKey: 'user_id', as: 'queries' });

    // REQUEST
    Request.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
    Property.hasMany(Request, { foreignKey: 'property_id', as: 'requests' });

    Request.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Request, { foreignKey: 'user_id', as: 'requests' });

    // OFFER
    Offer.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
    Property.hasMany(Offer, { foreignKey: 'property_id', as: 'offers' });

    Offer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(Offer, { foreignKey: 'user_id', as: 'offers' });

    Offer.belongsTo(Offer, { foreignKey: 'parent_id', as: 'parentOffer' });
    Offer.hasMany(Offer, { foreignKey: 'parent_id', as: 'childOffers' });
};