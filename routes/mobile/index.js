const router = require("express").Router();
const controller = require("./mobile.controller");

router.post("/", controller.root);
router.get("/", controller.root);


// 미들웨어를 타선 안되는 공개 라우터
router.post("/worker/signin", controller.signIn);
router.post("/worker/signup", controller.signUp);
router.post("/company/find", controller.fineCompanies);


router.use("/", controller.test);

/// 작업자 관련
router.post("/worker/find", controller.findWorker);
router.post("/worker/update", controller.updateWorkerInfo);
router.post("/worker/withdrawal", controller.withdrawal);

// 사업자 관련
router.post("/company/find/id", controller.findCompanyByID);
router.post("/company/confirm/pw", controller.confirmConpanyPW);

// 차량 관련
router.post("/car/register", controller.registerCar);
router.post("/car/find", controller.findCarByComID);
router.post("/car/update", controller.updateCar);
router.post("/car/delete", controller.deleteCar);

// 소독 이력 관련
router.post("/history/create", controller.createHistory);
router.post("/history/find", controller.findHistories);
router.post("/history/findOne", controller.findHistory);
router.post("/history/share",controller.registerKAKAO);

// 소독기 관련
router.post("/device/register", controller.registerDevice);
router.post("/device/find", controller.findDevices);
router.post("/device/update", controller.updateDevice);
router.post("/device/delete", controller.deleteDevice);
router.post("/device/find/id", controller.findDeviceByID);
router.post("/device/fine/one", controller.findOneDevice);

router.get("/sms",controller.registerSMS);


module.exports = router;
