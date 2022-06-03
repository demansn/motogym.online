const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocalizedTextSchema = new Schema({
    ru: {
        type: String,
        default: ''
    },
    ua: {
        type: String,
        default: ''
    },
    en: {
        type: String,
        required: true
    },
    ja: {
        type: String,
        default: ''
    }
});

module.exports = {LocalizedTextSchema};