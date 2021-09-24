var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helper');
/* GET home page. */
var wrong = false;

const checklog = (req, res, next) => {
  if (req.session.userloggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}
var Cnum = null;  
var cartCount = async (req, res, next) => {
  if (req.session.user) {
    Cnum = await userHelpers.cartCount(req.session.user._id);
    next();
  } else {
    Cnum = null;
    next();
  }

};

router.get('/', cartCount, function (req, res) {
  let user = req.session.user;
  productHelpers.getAllProducts().then((mobile) => {
    res.render('user/user', { admin: false, mobile, user, Cnumber: Cnum });

  });
});
router.get('/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/login', { admin: false, wrong });
    wrong = false;
  }

});
router.get('/signup', function (req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/signup', { admin: false });
  }

});
router.post('/signup', function (req, res) {
  userHelpers.doSignup(req.body).then((responce) => {
    console.log('Account created');
    req.session.user = responce.user;
    req.session.userloggedIn = true;
    res.redirect('/');
    wrong = false;
  });
});
router.post('/login', function (req, res) {
  userHelpers.doLogin(req.body).then((responce) => {
    if (responce.status) {
      req.session.user = responce.user;
      req.session.userloggedIn = true;
      res.redirect('/');
      wrong = false;
    } else {
      res.redirect('/login');
      wrong = "Invalid username or password";
    }
  });
});
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.session.userloggedIn=false
  res.redirect('/');
});

router.get('/addtocart', checklog, (req, res) => {
  var pid = req.query.id;
  var uid = req.session.user._id;
  userHelpers.addtoCart(uid, pid).then((pro) => {
    res.json(pro);
  });
});
router.get('/carts', cartCount, checklog, (req, res) => {
  let user = req.session.user;
  userHelpers.getCartProducts(user._id).then(async (products) => {
    var total = await userHelpers.getTotalAmount(user._id);
    res.render('user/cart', { products, user, Cnumber: Cnum, total });
  });

});
router.post('/change-product-quantity', checklog, (req, res) => {
  userHelpers.changeProductQuantity(req.body).then((responce) => {
    res.json(responce);
  });
});
router.post('/remove-product', checklog, (req, res) => {
  userHelpers.removeProduct(req.body).then((responce) => {
    res.json(responce);
  });
});
router.get('/place-order', checklog, (req, res) => {
  let user = req.session.user;
  userHelpers.getTotalAmount(user._id).then((total) => {
    res.render('user/placeOrder', { user, total: total, Cnumber: Cnum });
  });

});
router.post('/place-order', checklog, async (req, res) => {
  let user = req.session.user;
  var products = await userHelpers.getCartProductList(req.body.userId);
  let total = await userHelpers.getTotalAmount(req.body.userId);
  userHelpers.placeOrders(req.body, products, total).then((orderId) => {
    var orderId = orderId;
    if (req.body['pay_method'] == 'COD') {
      res.json({ paySuccess: true });
    } else if (req.body['pay_method'] == 'ONLINE') {
      userHelpers.generateRazorpay(orderId, total).then((responce) => {
        res.json(responce);
      });
    }

  });
});
router.get('/orders', checklog, async (req, res) => {
  var user = req.session.user;
  var orders = await userHelpers.getOrderProducts(user._id);
  res.render('user/orders', { orders, user, Cnumber: Cnum });
});
router.post('/verify-payment', checklog, async (req, res) => {
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then((responce) => {
    userHelpers.changePaymentStatus(req.body['order[receipt]'], req.session.user._id);
    res.json({ status: true });
    console.log('success');
  }).catch((err) => {
    console.log(err);
    res.json({ status: false });
  });

});


module.exports = router;

