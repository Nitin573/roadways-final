const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Truck = require('./models/Truck');

const app = express();

// ✅ CORS Settings
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

const MONGO_URL = "mongodb+srv://rahul:rahul123@cluster0.9au95i1.mongodb.net/roadways_db?appName=Cluster0";

// 🔥 SMART DATABASE CONNECTION (Vercel Fix)
// Yeh variable connection ko yaad rakhega
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return; // Agar pehle se connected hai, toh wahi use karo
    }
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ New Database Connection Established");
    } catch (error) {
        console.log("❌ Database Connection Failed:", error);
        throw error; // Error aage bhejo taaki request fail ho jaye
    }
};

// --- ROUTES ---

app.get('/', (req, res) => res.send("Roadways Backend is Live! 🚀"));

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        await connectDB(); // 🛑 PEHLE DATABASE SE CONNECT KARO, PHIR AAGE BADHO

        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account Created Successfully!" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        await connectDB(); // 🛑 LOGIN SE PEHLE BHI CONNECT KARO

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        res.json({ message: "Login Success", user: user.name });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// Local Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;