const fs = require("fs");
var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');
var fileUpload = require('express-fileupload');
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
const { RSA_NO_PADDING } = require("constants");
const adminHelpers = require('../helpers/admin-helpers');
var wrong = false;



const checklog = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}
router.get('/', function (req, res, next) {
  let adminD = req.session.admin;
  res.render('admin/admin', { admin: true ,adminD});

});
router.get('/login', function (req, res) {
  if (req.session.admin) {
    res.redirect('/');
  } else {
    res.render('admin/login', { admin: true, wrong });
    wrong = false;
  }

});
router.get('/logout', function (req, res) {
  req.session.admin = null;
  adminLoggedIn = false
  res.redirect('/admin');
});
router.post('/login', function (req, res) {
  adminHelpers.doLogin(req.body).then((responce) => {
    if (responce.status) {
      req.session.admin = responce.admin;
      req.session.adminLoggedIn = true;
      res.redirect('/admin');
      wrong = false;
    } else {
      res.redirect('/admin/login');
      wrong = "Invalid username or password";
    }
  });
});
Handlebars.registerHelper("incrementIndex", function (index) {
  return index + 1;
});
router.get('/products', checklog,function (req, res, next) {


  productHelpers.getAllProducts().then((mobile) => {
    let adminD = req.session.admin;
    res.render('admin/products', { admin: true, mobile,adminD });
  });

});
router.get('/add-product',checklog, function (req, res, next) {
  let adminD = req.session.admin;
  res.render('admin/add-product', { admin: true,adminD });

});
router.post('/add-product',checklog, function (req, res, next) {

  if (!req.files || !req.body.Name || !req.body.Category) {
    res.redirect('/admin/add-product');
  } else {
    productHelpers.addProduct(req.body, (id) => {
      let image = req.files.Image;
      image.mv('public/productimage/' + id + '.jpg');
      res.redirect('/admin/products');
    });
  }

});
router.get('/delete-product/',checklog, (req, res) => {
  let proid = req.query.id;
  console.log(proid);
  productHelper.deleteProduct(proid).then((response) => {
    res.redirect('/admin/products');
  });
  const pathToFile = 'public/productimage/' + proid + '.jpg';
  fs.unlink(pathToFile, function (err) {
    if (err) {
      console.log('NO Image');
    } else {
      console.log("Successfully deleted the file.");
    }
  });
});
router.get('/edit-product/',checklog, (req, res) => {
  let adminD = req.session.admin;
  let proid = req.query.id;
  productHelper.findProduct(proid).then((product) => {
    var pro = product;
    res.render('admin/edit-product', { admin: true, pro,adminD });
  });
});
router.post('/edit-product', checklog,(req, res) => {
  if (!req.body.Name || !req.body.Category) {
    res.redirect('/admin/add-product');
  } else {
    let id = req.query.id;
    productHelper.editProduct(req.body, id).then(() => {
      if (req.files) {
        const pathToFile = 'public/productimage/' + id + '.jpg';
        let image = req.files.Image;
        image.mv('public/productimage/' + id + '.jpg');
        res.redirect('/admin/products');
      } else {
        res.redirect('/admin/products');
      }
    });
  }
  
});
router.get('/orders', checklog, async(req,res)=>{
  let adminD = req.session.admin;
  console.log('haiiii');
  var orderList = await adminHelpers.getOrders();
  console.log(orderList.user);
  res.render('admin/orders',{admin: true,orders:orderList,adminD});
});
router.get('/order-details',checklog,async(req,res)=>{
  let order = req.query.order;
  let adminD = req.session.admin;
  var orderDetails = await adminHelpers.getOrdersDetails(order);
  console.log(orderDetails);
  res.render('admin/orderDetails',{orderDetails,admin:true,adminD})
});

module.exports = router;
