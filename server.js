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
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, "0.0.0.0",() => {
    console.log(`Server is running on http://localhost:${port}`);
});
