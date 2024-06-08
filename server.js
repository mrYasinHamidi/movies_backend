const express = require('express');

const app = express();
const db = require('./services/db');
const errorHandler = require("./services/error_handler");

const port = process.env.PORT || 3000;

db.connect_db();

app.use(express.json());

app.use('/api/v1/auth', require('./routes/auth'));

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
