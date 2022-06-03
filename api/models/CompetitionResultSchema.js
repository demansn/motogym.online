const MotorcycleSchema = require('./MotorcycleSchema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompetitionResultStatus = {
    PENDING: 'pending',
    APPROVE: 'approve',
    REJECTED: 'rejected',
    WITHOUT_VIDEO: 'withoutvideo'
};

const CompetitionResultSchema = new Schema({
    date: Date,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    motorcycle: {
        type: MotorcycleSchema,
        required: true,
    },
    time: {
        type: Number,
        required: true
    },
    fine: {
        type: Number,
        default: 0
    },
    video: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(CompetitionResultStatus),
        default: CompetitionResultStatus.PENDING
    }
});

module.exports = {CompetitionResultSchema, CompetitionResultStatus};