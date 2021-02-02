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

router.post("/", controller.root);
router.get("/", controller.root);

module.exports = router;
