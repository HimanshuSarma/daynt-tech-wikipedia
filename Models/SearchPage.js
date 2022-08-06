const mongoose = require('mongoose');

const SearchPageSchema = mongoose.Schema({
    pageid: {type: Number, required: true},
    pageTitle: {type: String, required: true},
    wikipediaUrl: {type: String, required: true},
    totalVisits: {type: Number, required: true}
})


const searchPageSchema = mongoose.model('SearchPage', SearchPageSchema);
module.exports = searchPageSchema;