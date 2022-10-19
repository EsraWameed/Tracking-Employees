const express = require('express');
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: Pass_DB,
  database: 'employeeTrack_DB',
});






//Listening to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  