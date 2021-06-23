const mongoose = require('mongoose');

const { ALARM_COMPLETE, CAR, CAR_DELETE,
        COMPANY, DEVICE, DEVICE_DELETE,
        GOODS, GOODS_OPTION, HISTORY,
        NOTICE, ORDER, ORDER_DETAIL,
        POINT, PUBLISH, WORKER, WORKER_DELETE
      } = require('../const/consts');
      
const COLLECTION_NAME = {
    "Alarm" : "Alarm",
    "Car" : "Car",
    "Cardelete" : "Cardelete",
    "Company" : "Company",
    "Device" : "Device",
    "Devicedelete" : "Devicedelete",
    "Goods" : "Goods",
    "GoodsOption" : "GoodsOption",
    "History" : "History",
    "Notice" : "Notice",
    "Order" : "Order",
    "OrderDetail" : "OrderDetail",
    "Point" : "Point",
    "Publish" : "Publish",
    "Worker" : "Worker",
    "Workerdelete" : "Workerdelete",
}

const { Schema } = mongoose;      

const { Alarm, Car, Cardelete, Company,
       Device, Devicedelete, Goods, GoodsOption,
       History, Notice, Order, OrderDetail,
       Point, Publish, Worker, Workerdelete } = Schema;
      
      
exports.findOneDocument = async (req,res,next,collection) => {
    var Collection = collection;
    var doc = req.body;
    var postJob;
    console.log(collection)
    var COLLECTIONS = Schema[collection];
    console.log(COLLECTIONS);
    switch (collection) {
        case COLLECTIONS.Alarm : 
            break;
        case COLLECTIONS.Car :
            break;
    }
    
    const resResult = (document) => {
      if (postJob != null) {
         postJob();
      }
      res.json({
         result: true,
         data: JSON.stringify(document),
      });
   };
   
   await Collection.findOne(doc).then(resResult).catch(next);
};