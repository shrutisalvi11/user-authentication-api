const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const userModel = require("../../db/models/user.model");

const createUser = async (req, res) => {
    try {
        const reqData = req.body;
        if(!reqData.name || reqData.name == "" || !reqData.username || reqData.username == "" ||!reqData.password || reqData.password == "" ){
            return res.status(400).json({status: false, message: 'keys [name, username, password] is required & cannot be null'})
        }
        const userExist = await userModel.findOne({ where: 
            { 
                username: reqData.username.toLowerCase()
            } 
        });

        /** checking whether user already exist */
        if (userExist != null) {
            return res.status(409).json({status: false, message: 'User already exists!'})
        }

        const password = await bcrypt.hash(reqData.password, 10);
        const newUser = new userModel({
            name: reqData.name,
            username: reqData.username,
            password: password,
            isActive: true
        });
        await newUser.save();

        /** jwt token creation */
        const token = jwt.sign(
            { 
                userId: newUser.id,
                userName: newUser.username
            },
            process.env.JWT_USER_SECRETKEY,
            { 
                expiresIn: process.env.JWTEXPIRY 
            }
        );
        return res.status(201).json({status: true, message: 'User registered successfully', data: {token}})
    } catch (error) {
        console.log(error)
        return res.status(400).json({status: false, message: 'Something went wrong!'})
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || username == "" || !password || password == ""){
            return res.status(400).json({status: false, message: 'keys [username, password] is required & cannot be null'})
        }
        /** checking whether user already exist */
        const user = await userModel.findOne({ 
            where: {
                username: username.toLowerCase(),
                isActive: true,
            },
            raw: true
        });

        if (user == null) {
            return res.status(400).json({status: false, message: 'User does not exist!'})
        }

        /** Password validity check */
        const flag = await bcrypt.compare(password, user.password);
        if (!flag) {
            return res.status(403).json({status: false, message: 'Unauthorized - Invalid credentials'})
        }

        /** jwt token creation */
        const token = jwt.sign(
            { 
                userId: user.id,
                userName: user.username
            },
            process.env.JWT_USER_SECRETKEY,
            { 
                expiresIn: process.env.JWTEXPIRY 
            }
        );
        return res.status(200).json({
            status: true, 
            message: 'User logged in successfully', 
            data: { 
                name: user.name,
                username: user.username,
                token: token 
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({status: false, message: 'Something went wrong!'})
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll({
            attributes: ['id', 'name', 'username'],
            raw: true,
            order: [
                ['createdAt', 'DESC']
            ]
        })
        return res.status(200).json({status: true, message: 'User Fetched Succesfully!', data: users})
    } catch (error) {
        console.log(error)
        return res.status(400).json({status: false, message: 'Something went wrong!'})
    }
};

module.exports = {
    createUser,
    login,
    getUsers
}