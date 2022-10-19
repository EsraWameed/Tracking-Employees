INSERT INTO department (name)
VALUES ("engineering"),
    ("finance"),
    ("Legal"),
    ("sales");

SELECT * FROM DEPARTMENT;

INSERT INTO role (title, salary, department_id)
VALUES ("software engineer", 220000, 1),
    ("project manager", 100000, 1),
    ("engineering manager", 305000, 1),
    ("accountant", 90000, 2),
    ("accounting manager", 190000, 2),
    ("Lawyer", 40000, 3),
    ("Legal Team Lead", 140000, 3),
    ("sales rep", 45000, 4);

SELECT * FROM ROLE;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hodham", "Yaseem", 3, NULL),
    ("Esra", "Al-Abduljabar", 3, 1),
    ("Ahmad", "Al-Abduljabar", 1, 2),
    ("Wameed", "Rajaa", 1, 2),
    ("Rajaa", "Abdulrazak", 2, 1);

SELECT * FROM employee;