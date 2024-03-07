const express = require('express');
const { createUser, login, getUsers } = require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create-user', createUser)
router.post('/auth', login)
router.get('/get-details', verifyToken, getUsers)

module.exports = router;
