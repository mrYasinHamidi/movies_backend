// // server.js
// const express = require('express');
//
//
// const app = express();
// const router = express.Router();
//
// router.get('/', (req, res) => {
//     res.send('API is working');
// });
// app.use(router);
//
// app.listen(5000, () => console.log(`Server started`));
const express = require('express');
const path = require('path');

const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const db_uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/movies';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(db_uri).then(() => {
    console.log(`connected to mongodb : ${db_uri}`);

})
app.get('/api', (req, res) => {
    res.send('API is working');
});

// Define a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${port} \n $db_uri: ${db_uri}`);
});
