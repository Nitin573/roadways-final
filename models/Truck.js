const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNo: String,
    ownerName: String,       // ✅ Naya Field: Malik ka Naam
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