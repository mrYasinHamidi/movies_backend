// server.js
const express = require('express');


const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    res.send('API is working');
});
app.use(router);

app.listen(5000, () => console.log(`Server started`));
