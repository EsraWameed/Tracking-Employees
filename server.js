//required dependencies
const express = require('express');
const mysql = require('mysql2');
const inquier = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
require('dotenv').config();
//port in use
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
// role update function
const employeeManager =  () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, resEmployee) => {
    if (err) throw err;
    const employeeSelection = [{
      name: 'None',
      value: 0
    }];
    resEmployee.forEach(({ first_name, last_name, id }) => {
      employeeSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
     
    let questionsArray = [
      {
        type: "list",
        name: "manager_id",
        choices: employeeSelection,
         message: "whose role do you want to update?"
      },
    ]
    inquier.prompt(questionsArray)
      .then(response => {
        let manager_id, query;
        if (response.manager_id) {
          query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, 
          r.title AS role, d.name AS department, CONCAT(m.first_name, " ", m.last_name) AS manager
          FROM EMPLOYEE AS e LEFT JOIN ROLE AS r ON e.role_id = r.id
          LEFT JOIN DEPARTMENT AS d ON r.department_id = d.id
          LEFT JOIN EMPLOYEE AS m ON e.manager_id = m.id
          WHERE e.manager_id = ?;`;
        } else {
          manager_id = null;
          query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, 
          r.title AS role, d.name AS department, CONCAT(m.first_name, " ", m.last_name) AS manager
          FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
          LEFT JOIN DEPARTMENT AS d ON r.department_id = d.id
          LEFT JOIN EMPLOYEE AS m ON e.manager_id = m.id
          WHERE e.manager_id is null;`;
        }
        connection.query(query, [response.manager_id], (err, res) => {
          if (err) throw err;
          console.table(res);
          choiceSelection();
        });
      })
      .catch(err => {
        console.error(err);
      }); 
  });
}
// function to view dep table, role, and employee table
const seeEvery = (table) => {
  let query;
  if (table === "DEPARTMENT") {
    query = `SELECT * FROM DEPARTMENT`;
  } else if (table === "ROLE") {
    query = `SELECT r.id AS id, title, salary, d.name AS department FROM ROLE AS r LEFT JOIN DEPARTMENT AS d ON r.department_id = d.id;`;
  } else {
    query = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, r.title AS role, d.name AS department, 
    CONCAT(m.first_name, " ", m.last_name) AS manager FROM EMPLOYEE AS e LEFT JOIN ROLE AS r ON e.role_id = r.id
    LEFT JOIN DEPARTMENT AS d ON r.department_id = d.id LEFT JOIN EMPLOYEE AS m ON e.manager_id = m.id;`;
  }
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    choiceSelection();
  });
};

//bonus functions
const managerUpdate = ()=> {
  connection.query("SELECT * FROM EMPLOYEE", (err, resEmployee) => {
    if (err) throw err;
    const employeeSelection = [];
    resEmployee.forEach(({ first_name, last_name, id }) => {
      employeeSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    const managerSelection = [{
      name: 'None',
      value: 0
    }]; 
    resEmployee.forEach(({ first_name, last_name, id }) => {
      managerSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
     
    let questionsArray = [
      {
        type: "list",
        name: "id",
        choices: employeeSelection,
        message: "Who to update?"
      },
      {
        type: "list",
        name: "manager_id",
        choices: managerSelection,
        message: "To which manager do you want to assign employee?"
      }
    ]
  
    inquier.prompt(questionsArray)
      .then(response => {
        const query = `UPDATE EMPLOYEE SET ? WHERE id = ?;`;
        let manager_id = response.manager_id !== 0? response.manager_id: null;
        connection.query(query, [{manager_id: manager_id}, response.id], (err, res) => {
          if (err) throw err;
          console.log("updated employee's manager");
          choiceSelection();
        });
      })
      .catch(err => {
      console.error(err);
      });
  })
};

const depDelete = () => {
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
        type: "list",
        name: "id",
        choices: departments,
        message: "Select a department to delete"
      }
    ];

    inquier.prompt(questionsArray)
    .then(response => {
      const query = `DELETE FROM DEPARTMENT WHERE id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} rows deleted!`);
        choiceSelection();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
};

const roleDelete = () => {
  const departments = [];
  connection.query("SELECT * FROM ROLE", (err, res) => {
    if (err) throw err;

    const roleChoice = [];
    res.forEach(({ title, id }) => {
      roleChoice.push({
        name: title,
        value: id
      });
    });

    let questionsArray = [
      {
        type: "list",
        name: "id",
        choices: roleChoice,
        message: "which role do u want to delete?"
      }
    ];

    inquier.prompt(questionsArray)
    .then(response => {
      const query = `DELETE FROM ROLE WHERE id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} rows deleted!`);
        choiceSelection();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
};

const employeeDelete = () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, res) => {
    if (err) throw err;

    const employeeSelection = [];
    res.forEach(({ first_name, last_name, id }) => {
      employeeSelection.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    let questionsArray = [
      {
        type: "list",
        name: "id",
        choices: employeeSelection,
        message: "which employee do u want to delete?"
      }
    ];

    inquier.prompt(questionsArray)
    .then(response => {
      const query = `DELETE FROM EMPLOYEE WHERE id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} rows deleted!`);
        choiceSelection();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
};

const seeBudget = () => {
  connection.query("SELECT * FROM DEPARTMENT", (err, res) => {
    if (err) throw err;

    const depChoice = [];
    res.forEach(({ name, id }) => {
      depChoice.push({
        name: name,
        value: id
      });
    });

    let questionsArray = [
      {
        type: "list",
        name: "id",
        choices: depChoice,
        message: "which department's budget do you want to see?"
      }
    ];
    inquier.prompt(questionsArray)
    .then(response => {
      const query = `SELECT D.name, SUM(salary) AS budget FROM
      EMPLOYEE AS E LEFT JOIN ROLE AS R
      ON E.role_id = R.id
      LEFT JOIN DEPARTMENT AS D
      ON R.department_id = D.id
      WHERE D.id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.table(res);
        choiceSelection();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });

};




//Listening to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  