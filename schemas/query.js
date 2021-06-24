const mongoose = require('mongoose');
const { Schema } = mongoose; 

const { ALARM_COMPLETE, CAR, CAR_DELETE,
        COMPANY, DEVICE, DEVICE_DELETE,
        GOODS, GOODS_OPTION, HISTORY,
        NOTICE, ORDER, ORDER_DETAIL,
        POINT, PUBLISH, WORKER, WORKER_DELETE,
        COLLECTION_NAME
      } = require('../const/consts'); //consts 파일들
      
const Schemas = require('./schemas')

const { Alarm, Car, Cardelete, Company,
       Device, Devicedelete, Goods, GoodsOption,
       History, Notice, Order, OrderDetail,
       Point, Publish, Worker, Workerdelete
       } = Schemas; // 몽구스 model 파일들
      
      
exports.findOneDocument = async (doc,collection) => {
    var Collection = Schemas[collection];
    var doc = doc;
    var postJob;
    
    console.log(collection)
    console.log(Collection)
    console.log(doc)
    
    
    switch (collection) {
        case COLLECTION_NAME.Alarm : 
            break;
        case COLLECTION_NAME.Car :
            break;
    }
    
    const resResult = (document) => {
      if (postJob != null) {
         postJob();
      }
    //   res.json({
    //      result: true,
    //      data: JSON.stringify(document),
    //   });
  };
   
//   await Collection.findOne(doc).then(resResult).catch(next);
};

exports.queryoption = () => {
    
}
