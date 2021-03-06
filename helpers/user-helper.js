/*jshint esversion: 6 */

var db = require('../config/connection');
var bcrypt = require('bcrypt');
const collection = require('../config/collection');
var objid = require('mongodb').ObjectId;
var Razorpay = require('razorpay');
const crypto =  require('crypto');


var instance = new Razorpay({ key_id: 'rzp_test_nyXfWw6c82FKiv', key_secret: 'fRmYl0sLISE1n4kzuPWZCHpp' });

module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            let responce = {};
            bcrypt.genSalt().then((salt) => {
                bcrypt.hash(userData.Password, salt).then((hash) => {
                    userData.Password = hash;
                    db.get().collection(collection.user).insertOne(userData).then((data) => {
                        loginst = true;
                        responce.user = userData;
                        responce.status = true;
                        resolve(responce);
                    });
                });
            });
        });

    }, doLogin: (userDatal) => {
        return new Promise(async (resolve, reject) => {
            let loginst = false;
            let responce = {};
            let mail = await db.get().collection(collection.user).findOne({ Email: userDatal.Email });
            if (mail) {
                bcrypt.compare(userDatal.Password, mail.Password).then((status) => {
                    if (status) {
                        console.log('logged in');
                        loginst = true;
                        responce.user = mail;
                        responce.status = true;
                        resolve(responce);
                    } else {
                        console.log('wrong password');
                        resolve({ status: false });
                    }
                });
            } else {
                console.log('wrong email');
                resolve({ status: false });
            }
        });
    },
    addtoCart: (uid, pid) => {
        let proObj = {
            item: objid(pid),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            var ucoll = await db.get().collection(collection.cart).findOne({ user: objid(uid) });
            if (ucoll) {

                let proExist = ucoll.product.findIndex(producte => producte.item == pid);
                console.log(proExist);
                if (proExist != -1) {
                    db.get().collection(collection.cart).updateOne({ 'product.item': objid(pid), user: objid(uid) }, { $inc: { 'product.$.quantity': 1 } }).then(() => {
                        var pro = { status: true, newp: false };
                        resolve(pro);
                    });
                } else {
                    db.get().collection(collection.cart).updateOne({ user: objid(uid) }, { $push: { product: proObj } }).then((responce) => {
                        var pro = { status: true, newp: true };
                        resolve(pro);
                    });
                }

            } else {

                let cartoj = {
                    user: objid(uid),
                    product: [proObj]
                };
                db.get().collection(collection.cart).insertOne(cartoj).then((responce) => {
                    var pro = { status: true, newp: true };
                    resolve(pro);
                });
            }
        });
    },
    getCart: (uid) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.cart).findOne({ user: objid(uid) }).then((product_det) => {
                db.get().collection(collection.prod).findOne({ _id: objid(product_det.product) }).then((prodcutd) => {
                    resolve(prodcutd);
                });
            });
        });
    }, getCartProducts: (uid) => {
        return new Promise(async (resolve, reject) => {
            var cartItems = await db.get().collection(collection.cart).aggregate([
                {
                    $match: { user: objid(uid) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.prod,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'productDetail'
                    }
                },
                {
                    $unwind: '$productDetail'
                }
            ]).toArray();
            resolve(cartItems);
        });
    }, cartCount: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.cart).findOne({ user: objid(id) }).then((pron) => {
                if (pron) {
                    var number = pron.product.length;
                    resolve(number);
                } else {
                    var number = 0;
                    resolve(number);
                }

            });
        });
    },
    changeProductQuantity: (detail) => {
        detail.count = parseInt(detail.count);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.cart).updateOne({ 'product.item': objid(detail.prod), _id: objid(detail.cart) }, { $inc: { 'product.$.quantity': detail.count } }).then((responce) => {
                let diff = { change: detail.count };
                resolve(diff);
            });
        });
    },
    removeProduct: (detail) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.cart).updateOne({ _id: objid(detail.cart) }, { $pull: { product: { item: objid(detail.prod) } } }).then(() => {
                var responce = { reslt: "productremoved" };
                resolve(responce);
            });
        });

    },
    getTotalAmount: (uid) => {
        return new Promise(async (resolve, reject) => {
            var total = await db.get().collection(collection.cart).aggregate([
                {
                    $match: { user: objid(uid) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.prod,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'productDetail'
                    }
                },
                {
                    $unwind: '$productDetail'
                }, {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', { $toInt: '$productDetail.Price' }] } }
                    }
                }
            ]).toArray()
            if (total[0]) {
                resolve(total[0].total);
            } else {
                resolve(0);
            }


        });

    },
    placeOrders: (detail, products, total) => {
        return new Promise((resolve, reject) => {
            let st = detail.pay_method === 'COD' ? 'Order Placed' : 'Order Pending';
            let orderObj = {

                deliveryDetails: {
                    mobile: detail.Mobile,
                    address: detail.Address,
                    Email: detail.Email,

                },
                status: st,
                date: new Date(),
                TotalPrice: total,
                userId: objid(detail.userId),
                payment: detail.pay_method,
                product: products


            };
            db.get().collection(collection.order).insertOne(orderObj).then((responce) => {
                if (orderObj.status == 'Order Placed') {
                    db.get().collection(collection.cart).deleteOne({ user: objid(detail.userId) });
                }
                resolve(responce.insertedId);
            });
        });

    },
    getCartProductList: (userId) => {

        return new Promise(async (resolve, reject) => {

            var cart = {

                product: null
            }
            cart = await db.get().collection(collection.cart).findOne({ user: objid(userId) });
            resolve(cart.product);
        });
    },
    getOrderProducts: (uid) => {
        return new Promise(async (resolve, reject) => {
            var orderList = await db.get().collection(collection.order).aggregate([
                {
                    $match: { userId: objid(uid) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity',
                        date: '$date',
                        payment: '$payment',
                        userId: '$userId',
                        Price: '$TotalPrice',
                        status: '$status'
                    }
                },
                {
                    $lookup: {
                        from: collection.prod,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'productDetail'
                    }
                },
                {
                    $unwind: '$productDetail'
                }
            ]).toArray();
            resolve(orderList);
        });
    },
    generateRazorpay: (orderId, price) => {
        return new Promise((resolve, reject) => {

            var options = {
                amount: price*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                resolve(order);
            });
        });
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            var hmac = crypto.createHmac('sha256', 'fRmYl0sLISE1n4kzuPWZCHpp');
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex');
            if(hmac==details['payment[razorpay_signature]']){
                resolve();
            }else{
                reject();
            }
            
        });
    },
    changePaymentStatus:(order,uid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.order).updateOne({_id:objid(order)},{$set:{status:'Order Placed'}}).then(()=>{
                db.get().collection(collection.cart).deleteOne({ user: objid(uid) });
                resolve();
            });
        });
    }

};