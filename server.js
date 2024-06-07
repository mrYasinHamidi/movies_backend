const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

require('./services/db').connect_db();

app.use(express.json());

app.use('/api/v1/auth',require('./routes/auth'));

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port : ${port}`);
});
