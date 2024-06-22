const { Router } = require('express');
const jwt = require("jsonwebtoken");

const Schema = require('../models/account');

module.exports = function (app) {
    const router = Router()

    router.get('/', async function (req, res) {
        try {
            const token = req.cookies.refreshToken;
            const data = jwt.verify(token, process.env.REFRECH_SECRET)

            const userData = await Schema.findOne({ email : data.email })

            const accessToken = jwt.sign({ username: userData.username, email: userData.email }, process.env.ACCESS_SECRET, { expiresIn: '1m', issuer: 'About Tech', });

            res.cookie("accessToken", accessToken, {
                secure: false,
                httpOnly: true,
            })

            return res.status(200).json({ code: 200, message: 'Access Token Recreated' });

        } catch (error) {
            return res.status(500).json({ code: 500, message: error });
        }

    });

    return router;
}

