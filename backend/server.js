const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/studentSupport', {
    serverSelectionTimeoutMS: 5000 
})
.then(() => console.log("✅ Connected to MongoDB at 127.0.0.1"))
.catch(err => console.log("❌ Connection Error:", err));

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'student'
        });
        
        await newUser.save();

        res.json({ message: "User registered successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.json({ 
            message: "Login successful", 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role || 'student'
            } 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login error" });
    }
});

app.post("/tickets", async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        await newTicket.save();
        res.json({ message: "Success!", ticket: newTicket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/tickets", async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/tickets/user/:userId", async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/tickets/:id/resolve", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { status: 'Resolved' }, 
            { new: true }
        );
        res.json({ message: "Ticket resolved!", ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("🚀 Server is running on port 3001");
});