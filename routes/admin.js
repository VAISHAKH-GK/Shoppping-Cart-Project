const fs = require("fs");
var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');
var fileUpload = require('express-fileupload');
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/admin', { admin: true });

});

Handlebars.registerHelper("incrementIndex", function (index) {
  return index + 1;
});
router.get('/products', function (req, res, next) {


  productHelpers.getAllProducts().then((mobile) => {
    console.log(mobile);
    res.render('admin/products', { admin: true, mobile });
  });

});
router.get('/add-product', function (req, res, next) {

  res.render('admin/add-product', { admin: true });

});
router.post('/add-product', function (req, res, next) {

  if (!req.files) {
    res.redirect('/admin/add-product');
  } else if (!req.body.Name) {
    res.redirect('/admin/add-product');
  } else if (!req.body.Category) {
    res.redirect('/admin/add-product');
  } else {
    productHelpers.addProduct(req.body, (id) => {
      let image = req.files.Image;
      image.mv('public/productimage/' + id + '.jpg', (err, done) => {
        if (!err) {
          res.redirect('/admin/productc');
        } else {
          res.redirect('/admin/productc');
        }
      });
    });
  }

});
router.get('/delete-product/', (req, res) => {
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


module.exports = router;
