const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' })
const app = require('./app');

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`app started on the PORT ${PORT}`);
})
mongoose.connect(process.env.DB_URL).then(con => {
    console.log('DB Connected Successfully');
});

