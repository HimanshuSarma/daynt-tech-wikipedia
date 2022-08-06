require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');

const AdminRoutes = require('./Routes/AdminRoutes');
const SearchRoutes = require('./Routes/SearchRoutes');
const AnalyticsRoutes = require('./Routes/AnalyticsRoutes');

const app = express();

app.use(cors({
    credentials: true,
    origin: 'https://daynt-tech.herokuapp.com'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(AdminRoutes);
app.use(SearchRoutes);
app.use(AnalyticsRoutes);

process.env.pwd = process.cwd();

if (process.env.ENVIRONMENT === 'production') {
    app.use(express.static(path.join(process.env.pwd, 'frontend', 'build')));
    app.use('*', (req, res) => {
        res.sendFile(path.join(process.env.pwd, 'frontend', 'build', 'index.html'));
    });
}

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to database');
    app.listen(process.env.PORT, () => {
        console.log(`Listening at port ${process.env.PORT}`);
    })
})
.catch(() => {
    console.log('Error occured')
})



