const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port
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
                'Quit'
            ],
        })
        .then((response) => {
            switch (response.prompt) {
                case 'Show all Employees':
                    return showEmployees(); 
                case 'Show Departments':
                    return showDepartment(); 
                case 'Show Roles':
                    return showRole(); 
                case 'Add New Department':
                    return addDepartment(); 
                // "Remove Employee", 
                case 'Add new Role':
                    return addRole(); 
                // "Update Employee Manager", 
                case 'Add new Employee':
                    return addEmployee();
                case 'Update Employee roles': 
                    return updateEmployee();
                case 'Quit':
                    return connection.end();
            }
        })
}
//shows
const showEmployees = () => {
    connection.query('SELECT * FROM company_employees', (err, results) => {
        error ? console.error(err) : console.table(results);
        start();
    });
};

const showDepartment = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        error ? console.error(err) : console.table(results);
        start();
    });
};

const showRole = () => {
    connection.query('SELECT * FROM company_roles', (err, results) => {
        error ? console.error(err) : console.table(results);
        start();
    });
};
const selectRole = () => {
    let roleArray = [];
    connection.query('SELECT * FROM company_roles', (err, results) => {
        err ? console.error(err) : results.forEach(role => {
            roleArray.push(role)
        });
    });
    return roleArray;
};

const selectManager = () => {
    let managerArray = [];
    connection.query('SELECT first_name, last_name FROM company_employees WHERE manager_id IS NULL', (err, results) => {
        err ? console.error(err) : results.forEach(manager => {
            managerArray.push(manager)
        });
    });
    return managerArray;
};

//adds
const addEmployee = () => {
    inquirer.prompt([{
        name: 'first',
        messsage: "What is the employee's first name?",
    }, {
        name: 'last',
        message: "What is the employee's last name?",
    }, {
        name: 'role',
        message: "What is the employee's role?",
        choices: selectRole()
    }, {
        name: 'manager',
        message: "Who is this employee's Manager?",
        choices: selectManager()
    }
    ])
        .then(function (val) {
            let roleID = selectRole().indexOf(val.role) + 1
            let managerID = selectManager().indexOf(val.manager) + 1
            connection.query('INSERT INTO company_employees SET ?',
                {
                    first_name: val.first,
                    last_name: val.last,
                    role_id: roleID,
                    manager_id: managerID
                }, (err) => {
                    err ? console.error(err) : console.table(val);
                    showEmployees();
                })
        })
}

const addRole = () => {
    inquirer
        .prompt([{
            name: 'roleName',
            message: 'What is the Role?'
        }, {
            name: 'salary',
            message: 'What is the Salary of this Role?'
        }])
        .then(({ roleName, salary }) => {
            connection.query('INSERT  INTO company_roles SET ?',
                { roleName, salary }, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    showRole();
                })
        })
}

const addDepartment = () => {
    inquirer
        .prompt([{
            name: 'newDepartment',
            message: 'What is the name of the new Department?'
        }
        ])
        .then(({ newDepartment }) => {
            connection.query('INSERT INTO department SET ?',
                { newDepartment }, (err, results) => {
                    err ? console.error(err) : console.log('New Department Added!');
                    showDepartment();
                })
        })
}

const updateEmployee = () => {
    connection.query('SELECT company_employees.id, company_roles.title FROM company_employees JOIN company_roles ON company_roles.role_id = role.id', (err, results) => {
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
                connection.query('UPDAATE company_employees SET WHERE ?',
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

