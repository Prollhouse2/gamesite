// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (ensure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/leaderboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Endpoint to save time
app.post('/api/time', async (req, res) => {
    const { name, time } = req.body;
    const user = await User.findOneAndUpdate(
        { name },
        { $inc: { time } },
        { new: true, upsert: true }
    );
    res.json(user);
});

// Endpoint to get the leaderboard
app.get('/api/leaderboard', async (req, res) => {
    const leaderboard = await User.find().sort({ time: -1 });
    res.json(leaderboard);
});

// Start the server on port 2222
const PORT = 2222; // Use port 2222 as specified
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
