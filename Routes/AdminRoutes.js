const express = require('express');
const Auth = require('../Auth/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = require('../Models/AdminModel');

const router = express.Router();

const expiry = parseInt(process.env.JWT_EXPIRY);

const count = 1;

router.get("/admin-user/check-login", Auth, (req, res) => {
    res.status(200).json({expiresIn: expiry});
});

router.get("/admin-user/refresh-token", Auth, async (req, res) => {
    const user = req.rootUser;
    const userInDB = await adminSchema.findById(user._id);
    const token = jwt.sign({_id: userInDB._id}, process.env.JWT_SECRET_KEY);
    count += 1;
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + expiry),
        maxAge: expiry,
        sameSite: 'strict',
        secure: true,
        httpOnly: true
    }).status(200).json({ message: 'Login successfull', expiresIn: expiry, count });
})

router.post("/admin-user/login", async(req, res) => {
    try {
        const {username, password} = req.body;
        if(typeof username === 'string' && username !== '' && typeof password === 'string' && password !== '') {
            const userInDB = await adminSchema.find({username});
            if(userInDB.length === 1) {
                const isMatched = await bcrypt.compare(password, userInDB[0].password);
                if(isMatched) {
                    const token = jwt.sign({_id: userInDB[0]._id}, process.env.JWT_SECRET_KEY);
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + expiry),
                        maxAge: expiry,
                        sameSite: 'strict',
                        secure: true,
                        httpOnly: true
                    }).status(200).json({ message: 'Login successfull', expiresIn: expiry });
                } else {
                    return res.status(400).json({message: 'Password is incorrect.'});
                }
            } else {
                return res.status(400).json({message: 'Please fill in the credentials correctly.'});
            }
        } else {
            return res.status(400).json({message: 'Please fill in the credentials correctly.'});
        }
    } catch(err) {
        return res.status(500).json({message: 'Some error occured. Please try logging in again.'})
    }
})

router.get("/admin-user/logout", async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).send("user logged out");
    } catch(err) {
        return res.status(500).json({message: 'Something went wrong.'});
    }
})

module.exports = router;