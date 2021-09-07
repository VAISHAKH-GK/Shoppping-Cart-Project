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
let mobile = [
  {
    name: "IPhone",
    category: "Mobile",
    description: "New IPhone",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdsRM0sG0qHugLZXnEaOyEOUYv2n1Bme8ncA&usqp=CAU"

  },
  {
    name: "Samsung",
    category: "Mobile",
    description: "New Samsung Phone",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqeGMh5-qmgircxcIvW8z-w23M8_ccXpmvhQ&usqp=CAU"

  },
  {
    name: "OnePLus",
    category: "Mobile",
    description: "New Oneplus Phone",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFLaOsK6pAq_9T5aHQhythtrfYdwylAVFMw&usqp=CAU"

  },
  {
    name: "Redmi",
    category: "Mobile",
    description: "New Redmi phone",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOmJ6BVygxJ_iJo-kBpBkaqn5-umWxuvleMw&usqp=CAU"

  }
];
Handlebars.registerHelper("incrementIndex", function (index) {
  return index + 1;
});
router.get('/products', function (req, res, next) {

  res.render('admin/products', { admin: true, mobile });

});
router.get('/add-product', function (req, res, next) {

  res.render('admin/add-product', { admin: true });

});
router.post('/add-product', function (req, res, next) {

  console.log(req.body);
  console.log(req.files);
  productHelpers.addProduct(req.body,()=>{
    res.render('admin/add-product');
  });


});


module.exports = router;
