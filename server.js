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
  password: process.env.Pass_DB,
  database: 'employeeTrack_DB',
});
//allow for connection to employeeTrack DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected to ${PORT}`);
//add figlet to customize text
figlet.text('Employee Tracker', {
  font: 'puffy',
}, function(err, data) {
  if (err) {
    console.log('figlet not working');
  } else {
    console.log(data);
  }  
  choiceSelection();
});
});
//create function to allow for user selection of what to do
function choiceSelection() {
  const promptOne = [{
    type: "list",
    name: "choiceArray",
    message: "what would you like to do?",
    loop: false,
    choices: ["View all employees", "View all roles", "View all departments", "add an employee", "add a role", "add a department", "update role for an employee", "update employee's manager", "view employees by manager", "delete a department", "delete a role", "delete an employee", "View the total utilized budget of a department", "quit"]
  }]
  
  inquier.prompt(promptOne)
  .then(response => {
    switch (response.choiceArray) {
      case "View all employees":
        seeEvery("EMPLOYEE");
        break;
      case "View all roles":
        seeEvery("ROLE");
        break;
      case "View all departments":
        seeEvery("DEPARTMENT");
        break;
      case "add a department":
        departmentAdd();
        break;
      case "add a role":
        roleAdd();
        break;
      case "add an employee":
        employeeAdd();
        break;
      case "update role for an employee":
        roleUpdate();
        break;
      case "view employees by manager":
        employeeManager();
        break;
      case "update employee's manager":
        managerUpdate();
        break;
      case "delete a department":
        depDelete();
        break;
      case "delete a role":
        roleDelete();
        break;
      case "delete an employee":
        employeeDelete();
        break;
      case "View the total utilized budget of a department":
        seeBudget();
        break;
      default:
        connection.end();
    }
// if there's an error, catch it
})
.catch(err => {
  console.error(err);
});
}
//function to allow for a new department to be added 
const departmentAdd = () => {
  let questionsArray = [
    {
      type: "input",
      name: "name",
      message: "New department name?"
    }
  ];
  inquier.prompt(questionsArray)
  .then(response => {
    const query = `INSERT INTO department (name) VALUES (?)`;
    connection.query(query, [response.name], (err, res) => {
      if (err) throw err;
      console.log(`${response.name} department inserted`);
      //call choiceSelection() again to allow for new action selection
      choiceSelection();
    });
  })
  .catch(err => {
    console.error(err);
  });
}







//Listening to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  