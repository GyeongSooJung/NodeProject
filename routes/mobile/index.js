console.log("우헤해ㅔ");
const router = require("express").Router();
const controller = require("./mobile.controller");

///작업자 관련
router.post("/worker/find", controller.findWorker);
router.post("/worker/signin", controller.signIn);
router.post("/worker/signup", controller.signUp);
router.post("/worker/update",controller.updateWorkerInfo);
router.post("/worker/withdrawal", controller.withdrawal);

router.post("/company/find", controller.fineCompanies);
router.post("/company/find/id", controller.findCompanyByID);
router.post("/company/confirm/pw",controller.confirmConpanyPW);

router.post("/car/find",controller.findCarByComID);

router.post("/history/create",controller.createHistory);
router.post("/history/find",controller.findHistories);
router.post("/history/findOne",controller.findHistory);

router.post("/device/register",controller.registerDevice);
router.post("/device/find",controller.findDevices);
router.post("/device/update",controller.updateDevice);
router.post("/device/delete",controller.deleteDevice);

router.post("/", controller.root);
router.get("/", controller.root);

module.exports = router;
