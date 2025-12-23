const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNo: String,
    ownerName: String,
    ownerContact: String,    // ✅ Naya Field: Malik ka Mobile
    date: String,
    driver: String,
    driverContact: String,
    startLocation: String,
    endLocation: String,
    status: String,
    commissionTotal: Number,
    commissionPaid: Number
});

module.exports = mongoose.model('Truck', TruckSchema);