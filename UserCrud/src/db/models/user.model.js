const Sequelize = require('sequelize');
const { dbConnection } = require('../connection');
const userModel = dbConnection.define('user', {
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    isActive: {
        type: Sequelize.BOOLEAN
    },
},{freezeTableName: true});

module.exports = userModel;