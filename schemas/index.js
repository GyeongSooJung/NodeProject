const mongoose = require('mongoose');

const connect = () => {
    if(process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
<<<<<<< HEAD
    mongoose.connect('mongodb://54.254.0.80:9003/MK', {
=======
    mongoose.connect('mongodb://52.79.245.187:9005/MK', {
        // 13.125.32.71:27017
>>>>>>> 96d1065508ba7f0fa18d2243df670ddb52e2ea91
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