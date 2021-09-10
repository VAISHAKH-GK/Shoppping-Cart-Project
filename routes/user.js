var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helper');
/* GET home page. */
router.get('/', function (req, res, ) {
  productHelpers.getAllProducts().then((mobile)=>{
    res.render('user/user', { admin: false,mobile });

  });
});
router.get('/login', function (req, res, ) {
  res.render('user/login', { admin: false});
});
router.get('/signup', function (req, res, ) {
  res.render('user/signup', { admin: false});
});
router.post('/signup', function (req, res, ) {
  userHelpers.doSignup(req.body).then((responce)=>{
    console.log(responce);
  });
});

module.exports = router;

