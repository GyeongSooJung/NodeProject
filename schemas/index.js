require('dotenv').config();
const mongoose = require('mongoose');

const connect = () => {
    // const mongoCon = 'mongodb://test:test1234@18.140.74.102:9003/admin';
    const mongoCon = 'mongodb://'+process.env.MONGO_ID+':'+process.env.MONGO_PWD+'@'+process.env.MONGO_IP+':'+process.env.MONGO_PORT+'/admin';
    
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect(mongoCon, {dbName: 'OASIS'}, {
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