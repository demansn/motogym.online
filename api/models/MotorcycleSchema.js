const {Schema} = require('mongoose');

const MotorcycleSchema = new Schema({
    brand: {type: String, required: true},
    model: {type: String, required: true},
    productionYear: {type: String, default: ''},
});

module.exports = {MotorcycleSchema};