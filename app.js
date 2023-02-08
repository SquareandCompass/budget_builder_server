require('dotenv').config();
const express = require('express');
const app = express();
const log = console.log;
const PORT = process.env.PORT || 4001;

//* Imports
const { dbConnection } = require('./db');
const { userController, } = require('./controllers');

//* Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//* Routes
app.use('/user', userController);

//* Connection
const server = async() => {

    dbConnection();

    app.listen(PORT, () => log(`Server running on ${PORT}`))

}

server();
