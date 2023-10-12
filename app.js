const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const deviceRouter = require('./routes/device');
const userRouter = require('./routes/user');
const { authController } = require('./controllers/user');
app.use(cors());
app.use(express.json());


app.use('/api/users',userRouter);

app.use('/api/devices', authController,deviceRouter)

module.exports = app;