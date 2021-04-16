const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: '3306'
});

connection.connect((err) => {
    err ? console.error(err) : console.log(`Connected!`);
    start();
});

const start = () => {
    inquirer
        .prompt({
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Show all Employees',
                'Show Departments',
                'Show Roles',
                new inquirer.Separator(),
                'Add new Department',
                'Add new Role',
                'Add new Employee',
                new inquirer.Separator(),
                'Update Employee roles',
                new inquirer.Separator(),
                'Quit'
            ],
        })
        .then((response) => {
            switch (response.choices) {
                case 'Show all Employees':
                    showEmployees();
                    break;
                case 'Show Departments':
                    showDepartment();
                    break;
                case 'Show Roles':
                    showRole();
                    break;
                case 'Add new Department':
                    addDepartment();
                    break;
                case 'Add new Role':
                    addRole();
                    break;
                case 'Add new Employee':
                    addEmployee();
                    break;
                case 'Update Employee roles':
                    updateEmployee();
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        })
}

const showEmployees = () => {
    connection.query('SELECT * FROM company_employees', (err, results) => {
        err ? console.error(err) : console.table(results);
        start();
    });
}

const showDepartment = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        err ? console.error(err) : console.table(results);
        start();
    });
}

const showRole = () => {
    connection.query('SELECT * FROM company_roles', (err, results) => {
        err ? console.error(err) : console.table(results);
        start();
    });
}

//adds
const addEmployee = () => {
    connection.query('SELECT company_roles.id AS id, company_roles.title as title FROM company_roles', (err, results) => {
        err ? console.error(err) :
            inquirer.prompt([{
                name: 'firstName',
                message: "What is the employee's first name?",
            }, {
                name: 'lastName',
                message: "What is the employee's last name?",
            }, {
                name: 'employeeRole',
                message: "What is the employee's Role?",
                type: 'list',
                choices: results.map((role) => {
                    return {
                        name: `${role.id}: ${role.title}`,
                        value: role
                    }
                })
            }
            ]).then(({ firstName, lastName, employeeRole }) => {
                connection.query('SELECT id, first_name, last_name FROM company_employees WHERE (id IN (SELECT manager_id FROM company_employees));', (err, results) => {
                    err ? console.error(err) :
                        inquirer.prompt([{
                            name: 'manager',
                            type: 'list',
                            choices: results.map((management) => {
                                return {
                                    name: `${management.id}: ${management.last_name}, ${management.first_name}`,
                                    value: management
                                }
                            })
                        }]).then(({ manager }) => {
                            connection.query(`INSERT INTO company_employees (first_name, last_name, role_id, manager_id) 
                            VALUES ('${firstName}', '${lastName}', ${employeeRole.id}, ${manager.id});`, (err, results) => {
                                err ? console.error(err) : console.log('\nYou have successfully added a new employee!');
                                showEmployees();
                            })
                            start();
                        });
                });
            });
    });
}

const addRole = () => {
    inquirer
        .prompt([{
            name: 'title',
            message: 'What is the Role?'
        }, {
            name: 'salary',
            message: 'What is the Salary of this Role?'
        }])
        .then(({ title, salary }) => {
            connection.query('INSERT INTO company_roles SET ?',
                { title, salary }, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    showRole();
                });
        });
}

const addDepartment = () => {
    inquirer
        .prompt([{
            name: 'department_name',
            message: 'What is the name of the new Department?'
        }
        ])
        .then(({ department_name }) => {
            connection.query('INSERT INTO department SET ?',
                { department_name }, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    showDepartment();
                });
        });
}

const updateEmployee = () => {
    connection.query('SELECT company_employees.id AS employeeID, company_employees.last_name AS employeeLast, company_roles.id AS roleID, company_roles.title AS roleTitle FROM employee LEFT JOIN company_roles ON company_employees.role_id = role.id',
        (err, results) => {
            err ? console.error(err) : console.table(results);
            inquirer
                .prompt([{
                    name: 'identification',
                    message: 'Input your Employee ID',
                }, {
                    name: 'newRole',
                    type: 'list',
                    message: "What is the employee's new Role?",
                    choices: results.map((company_roles) => {
                        return {
                            name: `${company_roles.roleID}: ${company_roles.roleTitle}`,
                            value: company_roles
                        }
                    })
                }
                ]).then(({ identification, newRole }) => {
                    connection.query(`UPDATE company_employees SET role_id = ${newRole.roleID} WHERE company_employees.id = ${identification}`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        showEmployees();
                    });
                });
        });
}