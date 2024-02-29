const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const User = require("./schema/User.model");
const Questions = require("./schema/Questions.model");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/leetcode").then(() => console.log("DB Connected"))
    .catch((err) => console.log(`Error: ${err}`));

// Get all questions
app.get('/problems', async (req, res) => {
    try {
        const questions = await Questions.find({});
        return res.status(200).send(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Get a specific question by ID
app.get("/problem/:id", async (req, res) => {
    const questionId = req.params.id;

    try {
        const question = await Questions.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        return res.status(200).send(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// User login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Please fill up all fields!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Here you might want to generate a token for the authenticated user
        // and send it back as a response.
        return res.status(200).send({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

// User registration
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        return res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
