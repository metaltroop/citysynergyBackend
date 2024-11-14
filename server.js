// server.js
require('dotenv').config();
const express = require('express');
const { sequelize, connectDB } = require('./Config/database');
const authRoutes = require('./Routes/authRoutes');
const tenderRoutes = require('./Routes/tenderRoutes')
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 3000;

//below code is for cors localhost:4000
app.use(cors({ origin: "https://citysynergy.metaltroop.fun, http://localhost:5173", credentials: true }));

app.use(express.json());
// Test the database connection and sync models
connectDB();

// Sync the models
sequelize.sync({ alter: true }).then(() => {
    console.log('All models were synchronized successfully.');
}).catch((error) => {
    console.error('Error synchronizing models:', error);
});

app.use('/auth', authRoutes);
app.use('/tender', tenderRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('hello hola amigo');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
