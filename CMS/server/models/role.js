const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    permissions: {
        type: [],
        required: true
    }
});
module.exports = mongoose.model('Role', roleSchema);