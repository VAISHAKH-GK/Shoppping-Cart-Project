const fs = require("fs");
var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');
var fileUpload = require('express-fileupload');
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
const { RSA_NO_PADDING } = require("constants");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/admin', { admin: true });

});

Handlebars.registerHelper("incrementIndex", function (index) {
  return index + 1;
});
router.get('/products', function (req, res, next) {


  productHelpers.getAllProducts().then((mobile) => {
    res.render('admin/products', { admin: true, mobile });
  });

});
router.get('/add-product', function (req, res, next) {

  res.render('admin/add-product', { admin: true });

});
router.post('/add-product', function (req, res, next) {

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
router.get('/edit-product/', (req, res) => {
  let proid = req.query.id;
  productHelper.findProduct(proid).then((product) => {
    var pro = product;
    res.render('admin/edit-product', { admin: true, pro });
  });
});
router.post('/edit-product', (req, res) => {
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


module.exports = router;
