const express = require('express');
const cors = require('cors');


const apiRouter = require('./routes/api.js');

const app = express();

// express version 4.16.0+ has built-in JSON parsing capabilities
// using below statement for json body parser
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use('/api/v1', apiRouter);

const port = 8800;
app.listen(port, () => {
    console.log("Server listening on port:" + port);
});
