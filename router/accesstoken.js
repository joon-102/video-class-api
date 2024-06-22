const { Router } = require('express');
const jwt = require("jsonwebtoken");

const Schema = require('../models/account');

module.exports = function (app) {
    const router = Router()

    router.get('/', async function (req, res) {
        try {
            const token = req.cookies.accessToken;
            const data = jwt.verify(token, process.env.ACCESS_SECRET);

            const UserInfo = await Schema.findOne({ email : data.email })

            const { password, ...others } = UserInfo;

            res.status(200).json(others);
        } catch (error) {
            return res.status(500).json({ code: 500, message: error });
        }

    });

    return router;
}

