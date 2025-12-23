const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    truckNo: String,
    driver: String,
    driverContact: String,   // ✅ Naya Field: Driver Mobile
    startLocation: String,
    endLocation: String,
    status: String,
    commissionTotal: Number, // ✅ Naya Field: Total Commission (Kitna tha)
    commissionPaid: Number   // ✅ Naya Field: Paid (Kitna diya)
});

module.exports = mongoose.model('Truck', TruckSchema);