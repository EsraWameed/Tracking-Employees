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
    // added function to add new employee role
    const roleAdd = () => {
      const departments = [];
      connection.query("SELECT * FROM DEPARTMENT", (err, res) => {
        if (err) throw err;
        res.forEach(dep => {
          let depConst = {
            name: dep.name,
            value: dep.id
          }
          departments.push(depConst);
        });
    
        let questionsArray = [
          {
            type: "input",
            name: "title",
            message: "Insert title of new role"
          },
          {
            type: "input",
            name: "salary",
            message: "what is the salary of the new role?"
          },
          {
            type: "list",
            name: "department",
            choices: departments,
            message: "which department is this role in?"
          }
        ];
    
        inquier.prompt(questionsArray)
        .then(response => {
          const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
          connection.query(query, [[response.title, response.salary, response.department]], (err, res) => {
            if (err) throw err;
            console.log(`Successfully inserted ${response.title}`);
            choiceSelection();
          });
        })
        .catch(err => {
          console.error(err);
        });
      });
    }
// function to add a new employee
const employeeAdd = () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, resEmployee) => {
    if (err) throw err;
    const employeeSelection = [
      {
        name: 'None',
        value: 0
      }
    ]; 
    resEmployee.forEach(({ first_name, last_name, id }) => {
      employeeSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    connection.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roleChoice = [];
      rolRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
          });
        });
     
      let questionsArray = [
        {
          type: "input",
          name: "first_name",
          message: "employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "employee's last name?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "what is the employee's role?"
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeSelection,
          message: "Who is this employee's manager if any exist?"
        }
      ]
  
      inquier.prompt(questionsArray)
        .then(response => {
          const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
          let manager_id = response.manager_id !== 0? response.manager_id: null;
          connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
            if (err) throw err;
            console.log(`successfully inserted employee`);
            choiceSelection();
          });
        })
        .catch(err => {
          console.error(err);
        });
    })
  });
}
// function to update employee role
const roleUpdate = () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, resEmployee) => {
    if (err) throw err;
    const employeeSelection = [];
    resEmployee.forEach(({ first_name, last_name, id }) => {
      employeeSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    connection.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roleChoice = [];
      rolRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
          });
        });
     
      let questionsArray = [
        {
          type: "list",
          name: "id",
          choices: employeeSelection,
          message: "whose role do you want to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "what is the employee's new role?"
        }
      ]
  
      inquier.prompt(questionsArray)
        .then(response => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          connection.query(query, [
            {role_id: response.role_id},
            "id",
            response.id
          ], (err, res) => {
            if (err) throw err;
            console.log("employee's role updated!");
            choiceSelection();
          });
        })
        .catch(err => {
          console.error(err);
        });
      })
  });
}





//Listening to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  