const User = require('./user.model');
const Query = require('./query.model');
const Request = require('./request.model');
const Offer = require('./offer.model');
const Property = require('./property.model');

//Property.belongsTo(User, { foreignKey: 'korisnik_id', as: 'owner' });
//User.hasMany(Property, { foreignKey: 'korisnik_id', as: 'properties' });

// QUERY
Query.belongsTo(Property, { foreignKey: 'nekretnina_id', as: 'property' });
Property.hasMany(Query, { foreignKey: 'nekretnina_id', as: 'queries' });

Query.belongsTo(User, { foreignKey: 'korisnik_id', as: 'user' });
User.hasMany(Query, { foreignKey: 'korisnik_id', as: 'queries' });

// REQUEST
Request.belongsTo(Property, { foreignKey: 'nekretnina_id', as: 'property' });
Property.hasMany(Request, { foreignKey: 'nekretnina_id', as: 'requests' });

Request.belongsTo(User, { foreignKey: 'korisnik_id', as: 'user' });
User.hasMany(Request, { foreignKey: 'korisnik_id', as: 'requests' });

// OFFER
Offer.belongsTo(Property, { foreignKey: 'nekretnina_id', as: 'property' });
Property.hasMany(Offer, { foreignKey: 'nekretnina_id', as: 'offers' });

Offer.belongsTo(User, { foreignKey: 'korisnik_id', as: 'user' });
User.hasMany(Offer, { foreignKey: 'korisnik_id', as: 'offers' });

Offer.belongsTo(Offer, { foreignKey: 'parentOfferId', as: 'parentOffer' });
Offer.hasMany(Offer, { foreignKey: 'parentOfferId', as: 'childOffers' });