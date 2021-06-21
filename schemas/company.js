const mongoose = require('mongoose');
const {Company} = require('../const/company');

const { Schema } = mongoose;
const CompanySchema = new Schema(Company, { collection: 'Company' });

module.exports = mongoose.model('Company', CompanySchema, 'Company');
