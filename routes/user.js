var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helper');
/* GET home page. */
var wrong = false;

const checklog = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
var Cnum = null;
var cartCount = async (req, res, next) => {
  if (req.session.user) {
    Cnum= await userHelpers.cartCount(req.session.user._id);
    next();
  } else {
    Cnum=null;
    next();
  }
  
};

router.get('/',cartCount, function (req, res) {
  let user = req.session.user;
  productHelpers.getAllProducts().then((mobile) => {
    res.render('user/user', { admin: false, mobile, user,Cnumber:Cnum });

  });
});
router.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/login', { admin: false, wrong });
    wrong = false;
  }

});
router.get('/signup', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/signup', { admin: false });
  }

});
router.post('/signup', function (req, res) {
  userHelpers.doSignup(req.body).then((responce) => {
    console.log('Account created');
    req.session.loggedIn = true;
    req.session.user = responce.user;
    res.redirect('/');
    wrong = false;
  });
});
router.post('/login', function (req, res) {
  userHelpers.doLogin(req.body).then((responce) => {
    if (responce.status) {
      req.session.loggedIn = true;
      req.session.user = responce.user;
      res.redirect('/');
      wrong = false;
    } else {
      res.redirect('/login');
      wrong = "Invalid username or password";
    }
  });
});
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/addtocart', checklog, (req, res) => {
  var pid = req.query.id;
  var uid = req.session.user._id;
  userHelpers.addtoCart(uid, pid).then((pro) => {
    res.json(pro);
  });
});
router.get('/carts',cartCount, checklog,(req, res) => {
  let user = req.session.user;
  userHelpers.getCartProducts(user._id).then(async(products) => {
    var total = await userHelpers.getTotalAmount(user._id);
    res.render('user/cart', { products, user,Cnumber:Cnum,total });
  });

});
router.post('/change-product-quantity',checklog,(req,res)=>{
    userHelpers.changeProductQuantity(req.body).then((responce)=>{
      res.json(responce);
    });
});
router.post('/remove-product',checklog,(req,res)=>{
  userHelpers.removeProduct(req.body).then((responce)=>{
    res.json(responce);
  });
});
router.get('/place-order',checklog,(req,res)=>{
  let user = req.session.user;
  userHelpers.getTotalAmount(user._id).then((total)=>{
    res.render('user/placeOrder',{user,total:total,Cnumber:Cnum});
  });
  
});


module.exports = router;

