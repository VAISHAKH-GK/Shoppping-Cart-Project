var db = require('../config/connection');
var coll = require('../config/collection');
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

    }

}