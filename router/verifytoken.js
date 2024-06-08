const { Router } = require('express');
const jwt = require("jsonwebtoken");


module.exports = function (app) {
    const router = Router()

    router.get('/', async function (req, res) {
        try {
            const token = req.cookies.refreshToken;

            if (!token) return res.status(403).json({ message: 'No token provided' });

            jwt.verify(token, process.env.REFRECH_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: '만료되었습니다' });
                    }
                    return res.status(500).json({ message: 'Failed to authenticate token' });
                }
                return res.status(200).json({ message: '아직 유요함' });
            });
        } catch (error) {
            return res.status(500).json({ code: 500, message: error });
        }

    });

    return router;
}

