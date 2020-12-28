const router = require("express").Router();
const controller = require("./mobile.controller");

///작업자 관련
router.post("/worker/find", controller.findWorker);
router.post("/worker/signin", controller.signIn);
router.post("/worker/signup", controller.signUp);
router.post("/worker/withdrawal", controller.withdrawal);

router.post("/company/find", controller.fineCompanies);

router.post("/", controller.root);

module.exports = router;
