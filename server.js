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
                'Show all Employees by Department',
                'Show all Employees by  Role',
                new inquirer.Separator(),
                'Add new Department',
                'Add new Role',
                'Add new Employee',
                new inquirer.Separator(),
                'Update Employee roles'
            ],
        })
}

const showEmployees = () => {
    connection.query('SELECT * FROM company_employees', (err, results) => {
        error ? console.error(err) : console.table(results);
        start();
    });
};
//todo
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