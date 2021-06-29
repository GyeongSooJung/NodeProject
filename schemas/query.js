const mongoose = require('mongoose');
const { Schema } = mongoose; 

const { ALARM_COMPLETE, CAR, CAR_DELETE,
        COMPANY, DEVICE, DEVICE_DELETE,
        GOODS, GOODS_OPTION, HISTORY,
        NOTICE, ORDER, ORDER_DETAIL,
        POINT, PUBLISH, WORKER, WORKER_DELETE,
        COLLECTION_NAME, QUERY
      } = require('../const/consts'); //consts 파일들
      
const Schemas = require('./schemas')

const { Alarm, Car, Cardelete, Company,
       Device, Devicedelete, Goods, GoodsOption,
       History, Notice, Order, OrderDetail,
       Point, Publish, Worker, Workerdelete
       } = Schemas; // 몽구스 model 파일들

exports.modelQuery = async (query,collection,doc,option) => {
    
    var doc = doc;
    
    var Collection = Schemas[collection];
    var option = option;
    var one;
    
    
    
    
    if ( query == QUERY.Aggregate) {
        var aggregatearray = [];
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            if (doc.addFields) {
                aggregatearray.push({$addFields : doc.addFields});
            }
            if (doc.lookup) {
                aggregatearray.push({$lookup : doc.lookup});
            }
            if (doc.unwind) {
                aggregatearray.push({$unwind : doc.unwind});
            }
            if (doc.match) {
                aggregatearray.push({$match : doc.match});
            }
            if (doc.project) {
                aggregatearray.push({$project : doc.project});
            }
            if (doc.sort) {
                aggregatearray.push({$sort : doc.sort});
            }
            if (doc.limit) {
                aggregatearray.push({$limit : doc.limit});
            }
        }
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            var one = await Collection.aggregate([aggregatearray]);
            return one;
            
        }
        
    }
    
    else if ( query == QUERY.Create) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit && option.sort) {
                one = await Collection.find(doc).limit(option.limit).sort(option.sort);
            }
            else if (option.limit) {
                one = await Collection.find(doc).limit(option.limit);
            }
            else if (option.sort) {
                one = await Collection.find(doc).sort(option.sort);
            }
            return one;
        }
        else {
            one = await Collection.create(doc);
            return one;
        }
        
        
    }
    
    else if ( query == QUERY.InsertMany) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit && option.sort) {
                one = await Collection.find(doc).limit(option.limit).sort(option.sort);
            }
            else if (option.limit) {
                one = await Collection.find(doc).limit(option.limit);
            }
            else if (option.sort) {
                one = await Collection.find(doc).sort(option.sort);
            }
            return one;
        }
        else {
            one = await Collection.InsertMany(doc);
            return one;
        }
        
        
    }
    
    else if ( query == QUERY.Find) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            var where = doc.where;
            var findone = doc.find;
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit && option.sort) {
                one = await Collection.find(doc).limit(option.limit).sort(option.sort);
            }
            else if (option.limit) {
                one = await Collection.find(doc).limit(option.limit);
            }
            else if (option.sort) {
                one = await Collection.find(doc).sort(option.sort);
            }
        }
        else {
            one = await Collection.find(doc);
        }
        return one;
    }
    
    else if ( query == QUERY.Findone) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            var where = doc.where;
            var find = doc.find;
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit && option.sort) {
                one = await Collection.findOne(doc).limit(option.limit).sort(option.sort);
            }
            else if (option.limit) {
                one = await Collection.findOne(doc).limit(option.limit);
            }
            else if (option.sort) {
                one = await Collection.findOne(doc).sort(option.sort);
            }
            
        }
        else {
            if(where && find){
                Collection.where(where).findOne(find);
            }
            else{
            one = await Collection.findOne(doc);
            }
            
        }
        return one;
        
    }
    
    else if ( query == QUERY.Update) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            var where = doc.where;
            var update = doc.update;
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.where(where).update(update).setOptions({ runValidators: true }).exec();
            return one;
        }
    }
    
    else if ( query == QUERY.Updateone) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            var where = doc.where;
            var update = doc.update;
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.where(where).updateOne(update);
            return one;
        }
    }
    
    else if ( query == QUERY.Updateupsert) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            var where = doc.where;
            var update = doc.update;
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.update(where,update,{upsert : true});
            return one;
        }
    }
    
    else if ( query == QUERY.Remove) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.remove(doc);
            return one;
        }
        
        
    }
    
    else if ( query == QUERY.Count) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.count(doc);
            return one;
        }
        
        
    }
    
    else if ( query == QUERY.CountDoc) {
        
        switch (collection) {
            case COLLECTION_NAME.Alarm : 
                break;
            case COLLECTION_NAME.Car :
                break;
        }
        
        if(doc != undefined) {
            
        }
        
        if (Object.keys(option).length != 0) {
            if (option.limit) {
                
            }
            if (option.sort) {
                
            }
        }
        else {
            one = await Collection.countDocuments(doc);
            return one;
        }
    }
};
