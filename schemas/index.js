const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://18.140.74.102:9003/admin', {dbName: 'OASIS'}, {
        // 54.254.0.80:9003/MK

    }, (error) => {
        if (error) {
            console.log('DB Connection is Error', error);
        }
        else {
            console.log('DB Connect is SuccessFul!');
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
