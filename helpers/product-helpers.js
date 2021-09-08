var db = require('../config/connection');
module.exports={

    addProduct:(product,callback)=>{

        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            
            callback(data.insertedId);
        });

    },
    getAllProducts:()=>{

        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection('product').find().toArray();
            resolve(products);
        })

    }

}