const {Schema} = require('mongoose');
const {UserProfileSchema} = require('./UserProfileSchema');
const {TokenSchema} = require('./TokenSchema');
const {MotorcycleSchema} = require('./MotorcycleSchema');
const {ACCESS_LEVEL} = require('../config/AccessLevel');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessLevel: {
        type: Number,
        enum: Object.values(ACCESS_LEVEL),
        default: ACCESS_LEVEL.DRIVER
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    confirmationToken: TokenSchema,
    passwordResetToken: TokenSchema,
    date: {
        type: Date,
        default: Date.now()
    },
    profile: UserProfileSchema,
    motorcycles: [MotorcycleSchema]
});

module.exports = { UserSchema };