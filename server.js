// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

const connectDB = require('./src/config/db.config');

//connect to db
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//importing routes
let authRoutes = require("./src/routes/auth.routes")
let userRoutes = require("./src/routes/user.routes")

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/', (req,res) => {
    res.status(200).send({message: 'Welcome to the API'});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
