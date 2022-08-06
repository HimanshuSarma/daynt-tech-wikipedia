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

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cors({
//     credentials: true,
//     origin: true
// }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(AdminRoutes);
// app.use(SearchRoutes);
// app.use(AnalyticsRoutes);

// process.env.pwd = process.cwd();

// if (process.env.ENVIRONMENT === 'production') {
//     app.use(express.static(path.join(process.env.pwd, 'frontend', 'build')));
//     app.use('*', (req, res) => {
//         res.sendFile(path.join(process.env.pwd, 'frontend', 'build', 'index.html'));
//     });
// }

// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//     console.log('Connected to database');
//     const port = process.env.PORT;
//     app.listen(port, () => {
//         console.log(`Listening at port ${port}`);
//     })
// })
// .catch(() => {
//     console.log('Error occured')
// })

app.use((req, res) => {
    res.send('Hii');
})



