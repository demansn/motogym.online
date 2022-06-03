const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RacetrackAccess = {
    PRIVATE: 'private',
    PUBLIC: 'public'
};

const RacetrackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    map: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    openingDate: {
        type: String,
        default: ''
    },
    access: {
        type: String,
        enum: [RacetrackAccess.PRIVATE, RacetrackAccess.PUBLIC],
        default: RacetrackAccess.PRIVATE
    }
});

module.exports = {RacetrackSchema, RacetrackAccess};