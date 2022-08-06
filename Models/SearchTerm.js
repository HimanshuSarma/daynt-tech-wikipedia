const mongoose = require('mongoose');

const SearchTermSchema = mongoose.Schema({
    searchTerm: {type: String, required: true},
    totalQueries: {type: Number, required: true},
    createdAt: {
        date: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true}
    }
});

const searchTermSchema = mongoose.model('SearchTerm', SearchTermSchema);
module.exports = searchTermSchema;