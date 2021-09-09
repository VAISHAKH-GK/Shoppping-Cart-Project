var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((mobile)=>{
    res.render('user/user', { admin: false,mobile });

  });
});
router.get('/login', function (req, res, next) {
  res.render('user/login', { admin: false});
});

module.exports = router;

