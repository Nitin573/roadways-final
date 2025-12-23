const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNo: String,
    date: String,            // ✅ Nayi Cheez: Tareekh
    driver: String,
    driverContact: String,
    startLocation: String,
    endLocation: String,
    status: String,
    commissionTotal: Number,
    commissionPaid: Number
});

module.exports = mongoose.model('Truck', TruckSchema);