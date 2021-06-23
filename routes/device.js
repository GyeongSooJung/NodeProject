//Express
const express = require('express');
const router = express.Router();
//Module
const Mongoose = require('mongoose');
//Schemas
const Schema = require('../schemas/schemas');
const { Device, Devicedelete } = Schema;
//Middelware
const {isNotLoggedIn} = require('./middleware');

// -- Start Code -- //

//장비 등록
  //DB에 등록
router.post('/device_join', isNotLoggedIn, async (req, res, next) => {
  const { data } = req.body;
  const jsonData = JSON.parse(data);
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
    
  try {
    const exDevice = await Device.findOne({ "MAC" : jsonData.MAC });
    const check = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
    if (check.test(jsonData.MAC) == true) {
      if(!exDevice) {
        await Device.create({
          "CID" : CID,
          "MD" : jsonData.MD,
          "VER" : jsonData.VER,
          "MAC" : jsonData.MAC,
          "NN" : jsonData.NN
        });
        return res.send({ result : 'success', type: 'device' });
      }
      else {
        return res.send({ result : 'exist', type: 'device' });
      }
    }
    else {
      return res.send({ result : 'type', type: 'device' });
    }
  } catch(err) {
    res.send({ result : 'fail' });
    console.error(err);
    return next(err);
  }
});

// 수정 - 브라우저 나타내기
router.post('/ajax/device_list_edit1', isNotLoggedIn, async(req, res, next) => {
  const { device_id } = req.body;
  
  var ObjectId = Mongoose.Types.ObjectId;
  const deviceone = await Device.find({ _id : ObjectId(device_id) });
  
  res.send({ result : "success", deviceone : deviceone });
});

// 수정 - 데이터 수정
router.post('/ajax/device_list_edit2', isNotLoggedIn, async(req, res, next) => {
  const { VER, NN, CID, device_id } = req.body;
  
  try{
    await Device.where({"_id" : device_id})
      .update({
        "CID" : CID,
        "VER" : String(VER),
        "NN" : NN,
      }).setOptions({runValidators : true})
        .exec();
        
    return res.send({ result: 'success' });
    
  } catch(err) {
    res.send({ status : "fail" });
    console.error(err);
    next(err);
  }
});

//장비 한개 삭제
router.post('/ajax/device_deleteone', async (req, res, next) => {
  var select = req.body["select"];
  
  try {
    const deviceone = await Device.findOne({ "MAC" : select.split(' ') });
    await Devicedelete.create({
      "CID" : deviceone.CID,
      "MD" : deviceone.MD,
      "VER" : deviceone.VER,
      "NN" : deviceone.NN,
      "MAC" : deviceone.MAC
    });
    await Device.remove({ "MAC" : select.split(' ') });
    
    res.send({ result : 'success' });
    
  } catch (err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
    
  }
});

//장비 선택 삭제
router.post('/ajax/device_delete', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select[]"];
  
  try {
    if(!select) {
      res.send({ result : 'fail' });
    }
    else {
      
      if(typeof(select) == 'string') {
        const deviceone = await Device.findOne({"MAC" : select});
        await Devicedelete.create({
          "CID" : deviceone.CID,
          "MD" : deviceone.MD,
          "VER" : deviceone.VER,
          "NN" : deviceone.NN,
          "MAC" : deviceone.MAC
        });
        await Device.remove({ "MAC" : select });
        
      }
      else {
        for(var i = 0; i < select.length; i ++) {
          var deviceone = await Device.findOne({"MAC" : select[i]});   
          await Devicedelete.create({
            "CID" : deviceone.CID,
            "MD" : deviceone.MD,
            "VER" : deviceone.VER,
            "NN" : deviceone.NN,
            "MAC" : deviceone.MAC
          });
          await Device.remove({ "MAC" : select[i] });
        }
      }
      return res.send({ result : 'success' });
    }
  } catch (err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
  }
});

module.exports = router;