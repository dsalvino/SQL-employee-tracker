DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE department (
id INT PRIMARY KEY AUTO_INCREMENT,
department_name VARCHAR(30)
);

CREATE TABLE company_role (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT REFERENCES department(id)
);

CREATE TABLE company_employee (
id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30), 
last_name VARCHAR(30),
role_id INT REFERENCES company_role(id),
manager_id INT NULL REFERENCES company_employee(id)
);


