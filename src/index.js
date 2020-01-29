const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// Automatically parse incoming JSON to an Object
app.use(express.json());

// Add Routers
app.use(userRouter);
app.use(taskRouter);

// Listen on Port
app.listen(port, () => {
   console.log(`--> Server is up on port ${port} <--`);
});
