const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNo: String,
    status: String,
    driver: String,
    startLocation: String,
    endLocation: String
});

module.exports = mongoose.model('Truck', TruckSchema);