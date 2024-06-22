const { Router } = require('express');
const jwt = require("jsonwebtoken");

const Schema = require('../models/account');

module.exports = function (app) {
    const router = Router()

    router.post('/', async function (req, res) {

        const { email , password } = req.body;

        const UserInfo = await Schema.findOne({ email : email , password : password })

        if (!UserInfo) {
            return res.status(403).json({ code: 403, message: 'Not Authorized' });
        }

        try {
            const accessToken = jwt.sign({ email: UserInfo.email, username: UserInfo.username }, process.env.ACCESS_SECRET, { expiresIn: '1m', issuer: 'About Tech' });
            const refreshToken = jwt.sign({ email: UserInfo.email, username: UserInfo.username }, process.env.REFRECH_SECRET, { expiresIn: '1m', issuer: 'About Tech' })

            res.cookie("accessToken", accessToken, { secure: false, httpOnly: true })
            res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true })

            return res.status(200).json({ status: 200, message: 'login success' });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: 500, message: error });
        }

    });

    router.get('/success', async function (req, res) {
        try {
            const token = req.cookies.accessToken;
            const data = jwt.verify(token, process.env.ACCESS_SECRET);

            const userData = await Schema.findOne({ email : data.email })

            return res.status(200).json(userData);
        } catch (error) {
            return res.status(500).json({ code: 500, message: error });
        }

    });

    return router;
}

