const app = require('./app');
const port = process.env.PORT;

// Listen on Port
app.listen(port, () => {
   console.log(`--> Server is up on port ${port} <--`);
});
