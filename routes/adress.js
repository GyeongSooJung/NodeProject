const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
  res.cookie('ADR',req.body)
  //addrDetail/ roadAddrPart1/roadFullAdd0r
  res.redirect('/adress?success=true');
});


module.exports = router;