const mongoose = require('mongoose');


const { ALARM_COMPLETE, CAR, CAR_DELETE,
        COMPANY, DEVICE, DEVICE_DELETE,
        GOODS, GOODS_OPTION, HISTORY,
        NOTICE, ORDER, ORDER_DETAIL,
        POINT, PUBLISH, WORKER, WORKER_DELETE
      } = require('../const/consts');

const { Schema } = mongoose;

const alarmSchema = new Schema(ALARM_COMPLETE.schema, { collection: 'Alarm' });
const carSchema = new Schema(CAR.schema, { collection: 'Car'});
const car_deleteSchema = new Schema(CAR_DELETE.schema, { collection: 'car_delete'});
const companySchema = new Schema(COMPANY.schema, { collection: 'Company' });
const deviceSchema = new Schema( DEVICE.schema, {collection : 'device'});
const device_deleteSchema = new Schema(DEVICE_DELETE.schema,{collection : 'device_delete'});
const goodsSchema = new Schema(GOODS.schema, { collection: 'Goods' });
const goods_OptionSchema = new Schema(GOODS_OPTION.schema, { collection: 'Goods_Option' });
const historySchema = new Schema(HISTORY.schema, { collection: 'history' });
const noticeSchema = new Schema(NOTICE.schema, { collection: 'Notice' });
const OrderSchema = new Schema(ORDER.schema, { collection: 'Order' });
const Order_DetailSchema = new Schema(ORDER_DETAIL.schema, { collection: 'Order_Detail' });
const pointSchema = new Schema(POINT.schema, { collection: 'Point' });
const publishSchema = new Schema(PUBLISH.schema, { collection: 'Publish' });
const workerSchema = new Schema(WORKER.schema, { collection: 'worker' });
const worker_deleteSchema = new Schema(WORKER_DELETE.schema, { collection: 'worker_delete' });

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
    "Order" : Order,
    "OrderDetail" : OrderDetail,
    "Point" : Point,
    "Publish" : Publish,
    "Worker" : Worker,
    "Workerdelete" : Workerdelete,
}

module.exports = COLLECTIONS;




// function schemaSelect (collection) {
//     var Collection = collection;
//     const carSchema = new Schema(CAR.schema);
//     console.log(collection)
    // console.log( mongoose.model(collection, carSchema))
    // try {
    //     switch(collection) {
    //         case COLLECTIONS.Alarm :
    //             const AlarmSchema = new Schema(ALARM_COMPLETE.schema, { collection: 'Alarm' });
    //             module.exports = mongoose.model('Alarm', AlarmSchema, 'Alarm');
    //             break;
    //         case COLLECTIONS.Car :
    //             const carSchema = new Schema(CAR.schema);
    //             console.log(carSchema+"&&&&&&&")
    //             return  mongoose.model(collection, carSchema);
    //         case COLLECTIONS.Cardelete :// 
    //             const car_deleteSchema = new Schema(CAR_DELETE.schema);
    //             module.exports = mongoose.model('Car_delete', car_deleteSchema);
    //             break;
    //         case COLLECTIONS.Company :
    //             const CompanySchema = new Schema(COMPANY.schema, { collection: 'Company' });
    //             module.exports = mongoose.model('Company', CompanySchema, 'Company');
    //             break;
    //         case COLLECTIONS.Device :
    //             const deviceSchema = new Schema( DEVICE.schema, {collection : 'device'});
    //             module.exports = mongoose.model('device', deviceSchema,'device');
    //         case COLLECTIONS.Devicedelete :
    //             const device_deleteSchema = new Schema(DEVICE_DELETE.schema,{collection : 'device_delete'});
    //             module.exports = mongoose.model('device_delete', device_deleteSchema,'device_delete');
    //             break;
    //         case COLLECTIONS.Goods :
    //             const GoodsSchema = new Schema(GOODS.schema, { collection: 'Goods' });
    //             module.exports = mongoose.model('Goods', GoodsSchema, 'Goods');
    //             break;
    //         case COLLECTIONS.GoodsOption :
    //             const Goods_OptionSchema = new Schema(GOODS_OPTION.schema, { collection: 'Goods_Option' });
    //             module.exports = mongoose.model('Goods_Option', Goods_OptionSchema, 'Goods_Option');
    //             break;
    //         case COLLECTIONS.History :
    //             const historySchema = new Schema(HISTORY.schema, { collection: 'history' });
    //             module.exports = mongoose.model('history', historySchema, 'history');
    //             break;
    //         case COLLECTIONS.Notice :
    //             const NoticeSchema = new Schema(NOTICE.schema, { collection: 'Notice' });
    //             module.exports = mongoose.model('Notice', NoticeSchema, 'Notice');
    //             break;
    //         case COLLECTIONS.Order :
    //             const OrderSchema = new Schema(ORDER.schema, { collection: 'Order' });
    //             module.exports = mongoose.model('Order', OrderSchema, 'Order');
    //             break;
    //         case COLLECTIONS.OrderDetail :
    //             const Order_DetailSchema = new Schema(ORDER_DETAIL.schema, { collection: 'Order_Detail' });
    //             module.exports = mongoose.model('Order_Detail', Order_DetailSchema, 'Order_Detail');
    //             break;
    //         case COLLECTIONS.Point :
    //             const PointSchema = new Schema(POINT.schema, { collection: 'Point' });
    //             module.exports = mongoose.model('Point', PointSchema, 'Point');
    //             break;
    //         case COLLECTIONS.Publish :
    //             const PublishSchema = new Schema(PUBLISH.schema, { collection: 'Publish' });
    //             module.exports = mongoose.model('Publish', PublishSchema, 'Publish');
    //             break;
    //         case COLLECTIONS.Worker :
    //             const workerSchema = new Schema(WORKER.schema, { collection: 'worker' });
    //             module.exports = mongoose.model('worker', workerSchema, 'worker');
    //             break;
    //         case COLLECTIONS.Workerdelete :
    //             const worker_deleteSchema = new Schema(WORKER_DELETE.schema, { collection: 'worker_delete' });
    //             module.exports = mongoose.model('worker_delete', worker_deleteSchema, 'worker_delete');
    //             break;
    //     }
    // }catch(e) {
    //     console.log(e)
    // }
// }

