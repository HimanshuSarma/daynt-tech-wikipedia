const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const adminSchema = mongoose.model('Admin', AdminSchema);
module.exports = adminSchema;