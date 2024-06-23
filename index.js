const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const express = require('express');
const path = require('node:path');
const dotenv = require("dotenv");
const helmet = require('helmet');
const fs = require('node:fs')
const cors = require('cors');

const app = express()
dotenv.config();

app.set("PORT", process.env.PORT)
app.set('MONGOOSE', process.env.MONGOOSE)

app.disable("x-powered-by");

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "https://video-class.vercel.app", methods: ["GET", "POST"], credentials: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://video-class.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

fs.readdirSync(path.join(process.cwd(), "router")).forEach(file => {
    try {
        app.use(`/api/v1/${file.split(".")[0]}`, require(path.join(process.cwd(), "router", file))(app));
    } catch (error) {
        console.error(error);
    }
});

mongoose.connect(app.get('MONGOOSE')).then(console.info("mongoose connected")).catch((error) => console.error(`mongoose connect Error : ${error}`));

app.all("*", async function (req, res) {
    return res.status(404).json({ "code": 404, "message": "This is an unknown path." })
})

app.listen(app.get('PORT'), () => {
    console.info('server on %d', app.get('PORT'));
});