const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Truck = require('./models/Truck'); // Truck Model Import kiya

const app = express();

// ✅ CORS Settings
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

const MONGO_URL = "mongodb+srv://rahul:rahul123@cluster0.9au95i1.mongodb.net/roadways_db?appName=Cluster0";

// 🔥 SMART DATABASE CONNECTION
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ Database Connected");
    } catch (error) {
        console.log("❌ Database Error:", error);
        throw error;
    }
};

// --- ROUTES ---

app.get('/', (req, res) => res.send("Roadways Backend is Live! 🚀"));

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        await connectDB();
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account Created Successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Signup Failed: " + err.message });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    try {
        await connectDB();
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        res.json({ message: "Login Success", user: user.name });
    } catch (err) {
        res.status(500).json({ error: "Login Error: " + err.message });
    }
});

// 🚛 3. ADD TRUCK ROUTE (Naya)
app.post('/api/add-truck', async (req, res) => {
    try {
        await connectDB(); // Database check
        const newTruck = new Truck(req.body); // Frontend se jo data aaya use lo
        await newTruck.save(); // Save karo
        res.status(201).json({ message: "Truck Added Successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add truck: " + err.message });
    }
});

// 🚛 4. GET ALL TRUCKS ROUTE (Naya)
app.get('/api/get-trucks', async (req, res) => {
    try {
        await connectDB();
        const trucks = await Truck.find(); // Saare trucks dhundo
        res.json(trucks); // Frontend ko bhejo
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch trucks" });
    }
});
// ... add-truck code ke neeche paste karein ...

// 🚛 5. UPDATE TRUCK ROUTE (Edit karne ke liye)
app.put('/api/update-truck/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        // Jo bhi naya data aayega, usse purana update ho jayega
        const updatedTruck = await Truck.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTruck);
    } catch (err) {
        res.status(500).json({ error: "Update failed: " + err.message });
    }
});

// ... baaki routes ke neeche ...

// 🔍 6. AUTO-FILL ROUTE (Truck Number se purani details lao)
app.get('/api/get-last-trip/:truckNo', async (req, res) => {
    try {
        await connectDB();
        const { truckNo } = req.params;
        
        // Sabse aakhri entry dhundo (sort by _id descending)
        const lastTrip = await Truck.findOne({ truckNo: truckNo }).sort({ _id: -1 });
        
        if (lastTrip) {
            res.json(lastTrip);
        } else {
            res.status(404).json({ message: "No history found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;