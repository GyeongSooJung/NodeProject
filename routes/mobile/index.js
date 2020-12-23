const router = require("express").Router();
const controller = require("./mobile.controller");

router.post("/worker/find", controller.findWorker);
router.post("/worker/signin", controller.signIn);

router.post("/company/find",controller.fineCompanies);

router.post("/", controller.root);

module.exports = router;
