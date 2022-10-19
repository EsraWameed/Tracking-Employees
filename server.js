const express = require('express');
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

<<<<<<< HEAD
// Express middleware
=======
>>>>>>> db725cb1555cda9a43e6b819997a0d22d367e0e6
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
<<<<<<< HEAD
  password: Pass_DB,
  database: 'employeeTrack_DB',
=======
  password:Pass_DB,
  database:'employeeTrack_DB',
>>>>>>> db725cb1555cda9a43e6b819997a0d22d367e0e6
});






<<<<<<< HEAD
//Listening to port
=======
//listening on port 
>>>>>>> db725cb1555cda9a43e6b819997a0d22d367e0e6
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  