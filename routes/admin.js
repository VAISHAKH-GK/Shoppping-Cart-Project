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


  productHelpers.addProduct(req.body, (id) => {

    let image = req.files.Image;
    image.mv('public/productimage/' + id + '.jpg', (err, done) => {
      if (!err) {

        res.render('admin/add-product', { admin: true });
      } else {
        console.log(err);
      }
    });

  });


});
router.get('/delete-product/', (req, res) => {
  let proid = req.query.id;
  console.log(proid);
  productHelper.deleteProduct(proid).then((response) => {
    res.redirect('/admin/products');
  });

  const pathToFile = 'public/productimage/'+proid+'.jpg';

  fs.unlink(pathToFile, function (err) {
    if (err) {
      throw err
    } else {
      console.log("Successfully deleted the file.");
    }
  });
});


module.exports = router;
