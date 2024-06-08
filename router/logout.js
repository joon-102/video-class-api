const { Router } = require('express');

module.exports = function (app) {
    const router = Router()

    router.post('/', async function (req, res, next) {
        try {
            res.cookie('accessToken', '');
            res.status(200).json("Logout Success");
        } catch (error) {
            return res.status(500).json({ code: 500, message: error });
        }
    });

    return router;
}

