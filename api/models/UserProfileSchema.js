const {Schema} = require('mongoose');

const UserProfileGender = {
    MALE: 'male',
    FEMALE: 'female'
};

const UserProfileSchema = new Schema({
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    gender: {
        type: String,
        enum: [UserProfileGender.MALE, UserProfileGender.FEMALE, ''],
        default: ''
    },
    birthday: {type: String, default: ''},
    country: {type: String, default: ''},
    city: {type: String, default: ''},
    avatar: {type: String, default: ''}
});

module.exports = {UserProfileSchema, UserProfileGender};