const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {LocalizedTextSchema} = require('./LocalizedTextSchema');

const TypesCompetitionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    regulation: {
        type: LocalizedTextSchema,
        required: true
    }
});

module.exports = {TypesCompetitionsSchema};