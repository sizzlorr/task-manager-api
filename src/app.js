const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// Automatically parse incoming JSON to an Object
app.use(express.json());

// Add Routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
