const router = require("./api/routes/user");
const { dbConnection } = require("./db/connection");
const express = require('express');
const userModel = require("./db/models/user.model");
const cors = require('cors');

const app = express();
require("dotenv").config();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: '*'
}))

userModel.sync()

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => {
    app.use('/api', router);
})