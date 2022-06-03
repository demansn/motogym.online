const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {LocalizedTextSchema} = require('./LocalizedTextSchema');
const {MotorcycleSchema} = require('./MotorcycleSchema');

const ChampionshipRoundResultStatus = {
    PENDING: 'pending',
    APPROVE: 'approve',
    REJECTED: 'rejected'
};

const ChampionshipRoundResultSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    motorcycle: {
        type: MotorcycleSchema,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    penalty: {
        type: Number,
        default: 0
    },
    video: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ChampionshipRoundResultStatus),
        default: ChampionshipRoundResultStatus.PENDING
    }
});

const ChampionshipRoundSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    racetrack: {
        type: String,
        default: ''
    },
    results: {
        type: [ChampionshipRoundResultSchema],
        default: []
    },
    start: {type: String, required: true},
    finish: {type: String, required: true},
    created: {type: String, default: () => Date.now()},
});

const ChampionshipSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: LocalizedTextSchema,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    rounds: {
        type: [ChampionshipRoundSchema],
        default: []
    }
});

module.exports = { ChampionshipSchema, ChampionshipRoundSchema, ChampionshipRoundResultSchema, ChampionshipRoundResultStatus};