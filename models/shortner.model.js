const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    qrCode: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
