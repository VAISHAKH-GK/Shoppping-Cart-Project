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
    console.log(user);
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
  userHelpers.addtoCart(uid, pid).then(() => {
    console.log('hai');
    res.json({status:true})
  });
});
router.get('/carts', checklog, (req, res) => {
  let user = req.session.user;
  userHelpers.getCartProducts(user._id).then((products) => {
    console.log(products);
    res.render('user/cart', { products, user });
  })

});


module.exports = router;

