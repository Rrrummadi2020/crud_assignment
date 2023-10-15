const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const deviceRouter = require('./routes/device');
const userRouter = require('./routes/user');
const { authController } = require('./controllers/user');
app.use(cors());
app.use(express.json());
app.use(mongoSanitize()); //  it will prevent the Query injection attacks like :-> "email": {"$gt":""},

app.use('/api/users', userRouter);

app.use('/api/devices', authController, deviceRouter);

module.exports = app;
