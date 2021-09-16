const crypto = require('crypto-js');
require('dotenv').config();

const encrypt = (data, cryptoKey) => {
    return crypto.AES.encrypt(data, process.env.cryptoKey).toString();
};
const decrypt = (data, cryptoKey) => {
    return crypto.AES.decrypt(data, process.env.cryptoKey).toString(crypto.enc.Utf8);
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;