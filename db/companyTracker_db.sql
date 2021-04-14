DROP DATABASE IF EXISTS companyTracker_db;
CREATE DATABASE companyTracker_db;
USE companyTracker_db;

CREATE TABLE department (
id INT PRIMARY KEY AUTO_INCREMENT,
department_name VARCHAR(30)
);

CREATE TABLE company_roles (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE company_employees (
id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30), 
last_name VARCHAR(30),
role_id INT,
FOREIGN KEY (role_id) REFERENCES company_roles(id),
manager_id INT,
FOREIGN KEY(manager_id) REFERENCES company_employees(id)
);

SELECT * FROM department;
SELECT * FROM company_roles;
SELECT * FROM company_employees;
SET GLOBAL FOREIGN_KEY_CHECKS=0;

INSERT INTO department(department_name)
VALUE ("Sales");
INSERT INTO department(department_name)
VALUE ("Engineering");
INSERT INTO department(department_name)
VALUE ("Finance");
INSERT INTO department(department_name)
VALUE ("Legal");

INSERT INTO company_roles(title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Software Engineer", 130000, 2);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Sales Manager", 110000, 1);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Salesperson", 90000, 1);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Acountant", 145000, 3);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Legal Assistant", 65000, 4);
INSERT INTO company_roles(title, salary, department_id)
VALUE ("Attorney", 200000, 4);

INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Meghan", "Buntin", null, 1);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Justin", "Miller", 1, 2);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Jordyn", "Lepley", null, 3);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Nick", "Siddens", 2, 4);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Corbin", "Haskin", null, 5);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Crystine", "Taylor", null, 6);
INSERT INTO company_employees(first_name, last_name, manager_id, role_id)
Value ("Bowen", "Wayne", null, 7);
