var db = require('../config/connection');
var coll = require('../config/collection');
var objid=require('mongodb').ObjectId;
module.exports={

    addProduct:(product,callback)=>{

        db.get().collection(coll.prod).insertOne(product).then((data)=>{
            callback(data.insertedId);
        });

    },
    getAllProducts:()=>{

        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection('product').find().toArray();
            resolve(products);
        });

    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            console.log(proId);
            console.log(objid(proId));
            db.get().collection(coll.prod).deleteOne({_id:objid(proId)}).then((response)=>{
                console.log(response);
                resolve(response);
            });
        });
    },
    editProduct:(product,id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(coll.prod).updateOne({_id:objid(id)},{$set:product}).then((data)=>{
                resolve();
            });
        });
        
    },findProduct:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(coll.prod).findOne({_id:objid(id)}).then((product)=>{
                resolve(product);
            });
        });
    }

}