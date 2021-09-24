const mongoose = require('mongoose');


const { ALARM_COMPLETE, CAR, CAR_DELETE,
        COMPANY, DEVICE, DEVICE_DELETE,
        GOODS, GOODS_OPTION, HISTORY,
        NOTICE, NOTICE_UPLOAD, ORDER, ORDER_DETAIL,
        POINT, PUBLISH, WORKER, WORKER_DELETE
      } = require('../const/consts');

const { Schema } = mongoose;

const alarmSchema = new Schema(ALARM_COMPLETE.schema, { collection: 'Alarm' });
const carSchema = new Schema(CAR.schema, { collection: 'Car' });
const car_deleteSchema = new Schema(CAR_DELETE.schema, { collection: 'Cardelete'});
const companySchema = new Schema(COMPANY.schema, { collection: 'Company' });
const deviceSchema = new Schema( DEVICE.schema, {collection : 'Device'});
const device_deleteSchema = new Schema(DEVICE_DELETE.schema,{collection : 'Devicedelete'});
const goodsSchema = new Schema(GOODS.schema, { collection: 'Goods' });
const goods_OptionSchema = new Schema(GOODS_OPTION.schema, { collection: 'GoodsOption' });
const historySchema = new Schema(HISTORY.schema, { collection: 'History' });
const noticeSchema = new Schema(NOTICE.schema, { collection: 'Notice' });
const notice_uploadSchema = new Schema(NOTICE_UPLOAD.schema, { collection: 'NoticeUpload' });
const OrderSchema = new Schema(ORDER.schema, { collection: 'Order' });
const Order_DetailSchema = new Schema(ORDER_DETAIL.schema, { collection: 'OrderDetail' });
const pointSchema = new Schema(POINT.schema, { collection: 'Point' });
const publishSchema = new Schema(PUBLISH.schema, { collection: 'Publish' });
const workerSchema = new Schema(WORKER.schema, { collection: 'Worker' });
const worker_deleteSchema = new Schema(WORKER_DELETE.schema, { collection: 'Workerdelete' });

const Alarm = mongoose.model('Alarm',alarmSchema);
const Car = mongoose.model('Car',carSchema);
const Cardelete = mongoose.model('Cardelete',car_deleteSchema);
const Company = mongoose.model('Company',companySchema);
const Device = mongoose.model('Device',deviceSchema);
const Devicedelete = mongoose.model('Devicedelete',device_deleteSchema);
const Goods = mongoose.model('Goods',goodsSchema);
const GoodsOption = mongoose.model('GoodsOption',goods_OptionSchema);
const History = mongoose.model('History',historySchema);
const Notice = mongoose.model('Notice',noticeSchema);
const NoticeUpload = mongoose.model('NoticeUpload',notice_uploadSchema);
const Order = mongoose.model('Order',OrderSchema);
const OrderDetail = mongoose.model('OrderDetail',Order_DetailSchema);
const Point = mongoose.model('Point',pointSchema);
const Publish = mongoose.model('Publish',publishSchema);
const Worker = mongoose.model('Worker',workerSchema);
const Workerdelete = mongoose.model('Workerdelete',worker_deleteSchema);


const COLLECTIONS = {
    "Alarm" : Alarm,
    "Car" : Car,
    "Cardelete" : Cardelete,
    "Company" : Company,
    "Device" : Device,
    "Devicedelete" : Devicedelete,
    "Goods" : Goods,
    "GoodsOption" : GoodsOption,
    "History" : History,
    "Notice" : Notice,
    "NoticeUpload" : NoticeUpload,
    "Order" : Order,
    "OrderDetail" : OrderDetail,
    "Point" : Point,
    "Publish" : Publish,
    "Worker" : Worker,
    "Workerdelete" : Workerdelete,
}

module.exports = COLLECTIONS;

