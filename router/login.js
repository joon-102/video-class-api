const { Router } = require('express');
const jwt = require("jsonwebtoken");

const Schema = require('../models/account');

module.exports = function (app) {
    const router = Router()

    router.post('/', async function (req, res, next) {
        const { email, username, password } = req.body;

        const UserInfo = await User.find({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if(!UserInfo) {
            return res.status(403).json({ code : 403 , message : 'Not Authorized' });
        }

        try { 
     
            const accessToken = jwt.sign({ email: UserInfo.email, username: UserInfo.username }, app.get('ACCESS_SECRET'), { expiresIn: '1m', issuer: 'About Tech' });
            const refreshToken = jwt.sign({ email: UserInfo.email, username: UserInfo.username }, app.get('REFRECH_SECRET'), { expiresIn: '24h', issuer: 'About Tech' })
            
            res.cookie("accessToken", accessToken, { secure: false, httpOnly: true })
            res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true })


        } catch(error) { 

        }

    });


    router.get('/', async function (req, res) { res.status(400).json({ "code": 400, "message": "A required request variable is missing." }) })



    return router;
}

