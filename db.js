const mongoose = require('mongoose');
const DBURL = process.env.DBURL;

const dbConnection = async () => {
    try {
        
        mongoose.set('strictQuery', true);

        await mongoose.connect(`${DBURL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`DB Connected to: ${DBURL}`);

    } catch (err) {
        console.log(`DB Error: ${err}`);
    }
}

module.exports = {dbConnection, mongoose};