const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Truck = require('./models/Truck');

const app = express();

// ✅ CORS: Sabko allow karo (Sabse Zaroori)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// ✅ DATABASE CONNECTION
// Aapka Naya Link + Password (rahul123) + Database Name (roadways_db)
const MONGO_URL = "mongodb+srv://rahul:rahul123@cluster0.9au95i1.mongodb.net/roadways_db?appName=Cluster0";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Cloud DB Connected Successfully!"))
    .catch((err) => console.log("❌ DB Connection Error:", err));

// --- ROUTES ---
app.get('/', (req, res) => res.send("Roadways Backend is Live! 🚀"));

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account Created Successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Signup Failed" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        res.json({ message: "Login Success", user: user.name });
    } catch (err) {
        res.status(500).json({ error: "Login Error" });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;