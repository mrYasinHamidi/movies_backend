require('dotenv').config();

const express = require('express');

const app = express();
const db = require('./databse/db');
const errorHandler = require("./middlewares/error_handler");
const authenticator = require("./middlewares/authenticator");
const authRoutes = require("./parts/authantication/routes/auth");
const userRoutes = require("./parts/user/routes/user");
const workPlaceRoutes = require("./parts/work_place/routes/work_place");
const shiftRotes = require("./parts/shift/routes/shift_routes");
const commuteRoutes = require("./parts/commute/routes/commute_routes");
const dashboardRoutes = require("./parts/dashboard/routes/dashboard_routes");
const responseWrapper = require("./middlewares/response_wrapper");
const port = process.env.PORT || 3000;

db.connect_db();

app.use(responseWrapper);

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use(authenticator);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/work_place', workPlaceRoutes);
app.use('/api/v1/shift', shiftRotes);
app.use('/api/v1/commute', commuteRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use(errorHandler);

const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port : ${port}`);
});

const shutdown = () => {
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
