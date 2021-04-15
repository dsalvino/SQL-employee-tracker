const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'process.env.host',
    user: 'process.env.user',
    password: 'process.env.password',
    database: 'process.env.database',
    port: '3306'
});

connection.connect((err) => {
    err ? console.error(err) : console.log(`connected as id  ${connection.threadId}/n`);
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
//shows
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
const selectRole = () => {
    let roleArray = [];
    connection.query('SELECT * FROM company_roles', (err, results) => {
        err ? console.error(err) : results.forEach(role => {
            roleArray.push(role);
        });
        return roleArray;
    });
}

const selectRole2 = () => {
    connection.query('SELECT * FROM company_roles', (err, results) => {
        let roleArray = [];
        err ? console.error(err) :
            results.forEach(({ id, title }) => {
                roleArray.push(id, title);
            });
        return roleArray;
    })
        .then((answer) => {
            let chosenRole;
            results.forEach((role) => {
                if (role.title === answer.choice) {
                    chosenRole = role;
                }
            });
        });
}

const selectManager = () => {
    let managerArray = [];
    connection.query('SELECT first_name, last_name FROM company_employees', (err, results) => {
        err ? console.error(err) : results.forEach(manager => {
            managerArray.push(manager);
            return managerArray;
        });
    });
}

//adds
const addEmployee = () => {
    inquirer.prompt([{
        name: 'firstName',
        message: "What is the employee's first name?",
    }, {
        name: 'lastName',
        message: "What is the employee's last name?",
    }, {
        name: 'role',
        message: "What is the employee's role?",
        type: 'list',
        choices: selectRole2()
    }, {
        name: 'manager',
        message: "Who is this employee's Manager?",
        type: 'list',
        choices: selectManager()
    }
    ])
        .then((val) => {
            let roleID = selectRole().indexOf(val.role) + 1
            var managerID = selectManager().indexOf(val.manager) + 1
            connection.query('INSERT INTO company_employees SET ?',
                {
                    first_name: val.firstName,
                    last_name: val.lastName,
                    manager_id: managerID,
                    role_id: roleID
                }, (err) => {
                    err ? console.error(err) : console.table(val)
                    showEmployees();
                });
        });
}

const addEmployee = () => {
    connection.query('SELECT * FROM company_roles', (err, result) => {
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
                choices() {
                    const roleArray = [];
                    results.forEach(({ title }) => {
                        roleArray.push(title);
                    });
                    return roleArray;
                },
                name: 'manager',
                message: "Who is this employee's Manager?",
                type: 'list',
                choices() {
                    const managerArray = [];
                    connection.query('SELECT * FROM company_employees', (err, results) => {
                        err ? console.error(err) :
                            results.forEach(({ first_name, last_name }) => {
                                managerArray.push(first_name, last_name);
                            });
                        return managerArray;
                    })
                }
            }
            ])
    })
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
    connection.query('SELECT company_employees.id, company_roles.title FROM company_employees JOIN company_roles ON company_roles.id = id', (err, results) => {
        err ? console.error(err) : console.table(results);
        inquirer
            .prompt([{
                name: 'identification',
                message: 'Enter your Employee ID',
                choices: () => {
                    let id = [];
                    results.forEach(persons => {
                        id.push(persons.id);
                        return id;
                    });
                }
            }, {
                name: 'newRole',
                type: 'list',
                message: "What is the employee's new Role?",
                choices: selectRole()
            }])
            .then((results) => {
                let roleID = selectRole().indexOf(results.newRole) + 1
                connection.query('UPDATE company_employees SET WHERE ?',
                    {
                        id: res.identification
                    }, {
                    role_id: roleID
                },
                    (err) => {
                        err ? console.error(err) : console.table(results);
                        start();
                    })

            })
    })
}

