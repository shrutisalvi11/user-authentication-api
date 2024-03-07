const userModel = require("../../db/models/user.model");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({status: false, message: 'Unauthorized Access or Invalid access token!'})
        }
        jwt.verify(
            token,
            process.env.JWT_USER_SECRETKEY,
            async function (err, decoded) {
                if (!err) {
                    const userData = JSON.parse(JSON.stringify(decoded));
                    console.log(userData)
                    const user = await userModel.findOne({ where: { id: userData.userId, isActive: true } });
                    if (user == null) {
                        return res.status(401).json({status: false, message: 'Unauthorized Access or Invalid access token!'})
                    }
                    next();
                } else {
                    console.log(err)
                    return res.status(401).json({status: false, message: 'Unauthorized Access or Invalid access token!'})
                }
            }
        );
    } catch (error) {
        return res.status(401).json({status: false, message: 'Unauthorized Access or Invalid access token!'})
    }
}

module.exports = verifyToken