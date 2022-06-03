const {Schema} = require('mongoose');
const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 43200
    }
});

module.exports = {TokenSchema};