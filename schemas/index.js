const mongoose = require('mongoose');

const connect = () => {
    if(process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://52.79.245.187:27017/MK', {
        // 13.125.32.71:27017
        dbName: 'MK',
    }, (error) => {
        if(error) {
            console.log('DB Connection is Error', error);
        } else {
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