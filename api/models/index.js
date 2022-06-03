const mongoose = require('mongoose');
const {UserSchema} = require('./UserSchema');
const {UserProfileGender, UserProfileSchema} = require('./UserProfileSchema');
const {CompetitionSchema} = require('./CompetitionSchema');
const {TypesCompetitionsSchema} = require('./TypesCompetitionsSchema');
const {CompetitionResultStatus} = require('./CompetitionResultSchema');
const {ChampionshipSchema, ChampionshipRoundResultStatus} = require('./ChampionshipSchema');

// create models
const User = mongoose.model('users', UserSchema);
const Competition = mongoose.model('competitions', CompetitionSchema);
const Championship = mongoose.model('championships', ChampionshipSchema);
const TypesCompetitions = mongoose.model('typescompetitions', TypesCompetitionsSchema);

module.exports = {
    UserSchema,
    UserProfileSchema,
    UserProfileGender,
    CompetitionSchema,
    CompetitionResultStatus,
    TypesCompetitionsSchema,
    User,
    Competition,
    TypesCompetitions,
    Championship,
    ChampionshipRoundResultStatus
};