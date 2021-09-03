var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

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

  res.render('index', {mobile,admin:false});
  
});

module.exports = router;
