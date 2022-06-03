const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {LocalizedTextSchema} = require('./LocalizedTextSchema');
const {CompetitionResultSchema} = require('./CompetitionResultSchema');

const CompetitionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: LocalizedTextSchema,
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'typescompetitions'
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    racetrack: {
        type: String,
        required: true
    },
    results: {
        type: [CompetitionResultSchema],
        default: []
    },
    start: {type: String, default: ''},
    finish: {type: String, default: ''},
    created: {type: String, default: '', required: true},
});

module.exports = { CompetitionSchema };