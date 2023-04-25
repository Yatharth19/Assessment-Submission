require('dotenv').config();
const express = require('express');
const fs = require('fs');
const util = require('util')
const { connectDB, db } = require('./db/database');
const app = express();
const User = require('./models/User');
const users1 = require('./routes/users1');
const users2 = require('./routes/users2');
const users3 = require('./routes/users3');
const users4 = require('./routes/users4');
const cities = require('./routes/cities');
const cors = require('cors');


app.get('/', (req, res) => {
    res.send('<h1>HI</h1>')
})
app.use(cors());
app.use('/api/users1', users1);
app.use('/api/users2', users2);
app.use('/api/users3', users3);
app.use('/api/users4', users4);
app.use('/api/cities', cities);


const PORT = process.env.port || 5000;

connectDB(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})