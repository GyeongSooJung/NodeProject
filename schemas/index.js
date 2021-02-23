require('dotenv').config();
const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect(process.env.MONGO_IP, {dbName: 'OASIS'}, {
        // 개발db : 18.140.74.102:9003/admin', {dbName: 'OASIS'}

    }, (error) => {
        if (error) {
            console.log('DB Connection is Error', error);
        }
        else {
            console.log('DB Connect is SuccessFul!');
            console.log("몽고몽고"+process.env.MONGO_PORT);
        }
    });
};
mongoose.connection.on('error', (error) => {
    console.error('DB Error', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('DB is disconnected, Continue to Connect DB');
    connect();
});

module.exports = connect;
