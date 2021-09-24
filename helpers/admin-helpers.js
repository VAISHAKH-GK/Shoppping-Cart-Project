var db = require('../config/connection');
var bcrypt = require('bcrypt');
const collection = require('../config/collection');
var objid = require('mongodb').ObjectId;
const { reject } = require('promise');


module.exports = {
    doLogin: (adminDatal) => {
        return new Promise(async (resolve, reject) => {
            let loginst = false;
            let responce = {};
            let mail = await db.get().collection(collection.admin).findOne({ Email: adminDatal.Email });
            if (mail) {
                bcrypt.compare(adminDatal.Password, mail.Password).then((status) => {
                    if (status) {
                        console.log('logged in');
                        loginst = true;
                        responce.admin = mail;
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
    getOrders: () => {
        return new Promise(async (resolve, reject) => {
            var orderList = await db.get().collection(collection.order).aggregate([
                {
                    $project: {
                        _id: '$_id',
                        date: '$date',
                        payment: '$payment',
                        userId: '$userId',
                        Price: '$TotalPrice',
                        status: '$status'
                    }
                },
                {
                    $lookup: {
                        from: collection.user,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ]).toArray();
            resolve(orderList);
        });
    },
    getOrdersDetails: (order) => {
        return new Promise(async (resolve, reject) => {
            var orderList = await db.get().collection(collection.order).aggregate([
                {
                    $match:{_id:objid(order)}
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {

                        delivary:'$deliveryDetails',
                        payment: '$payment',
                        userId: '$userId',
                        Price: '$TotalPrice',
                        item: '$product.item',
                        quantity: '$product.quantity',
                        status:'$status',
                    }
                },
                {
                    $unwind: '$delivary'
                },
                {
                    $lookup: {
                        from: collection.user,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
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
            console.log(orderList);
            resolve(orderList);
        });
    },
    getStatus:(orderId)=>{
        console.log('id'+orderId);
        return new Promise(async(resolve,reject)=>{
            var order= await db.get().collection(collection.order).findOne({_id:objid(orderId)});
            console.log('status :');
            console.log(order.status);
            resolve(order.status);
        });
        
    },
    updateStatus:(orderId,newstatus)=>{
        console.log('order :'+orderId+'status :'+newstatus);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.order).updateOne({_id:objid(orderId)},{$set:{status:newstatus}});
            resolve();
        }); 
    }

}