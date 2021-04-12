const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.host,
    process.env.user,
    process.env.password,
    process.env.database,
    {
        host: process.env.host,
        dialect: 'mysql',
        port: process.env.port,
    }
);

module.exports = sequelize;