var db = require('../config/connection');
var bcrypt = require('bcrypt');
const collection = require('../config/collection');
module.exports = {
    doSignup: (userData) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt().then((salt) => {
                bcrypt.hash(userData.Password, salt).then((hash) => {
                    userData.Password = hash;
                    userData.Password_2 = hash;
                    db.get().collection(collection.user).insertOne(userData).then((data) => {
                        resolve(data.Password);
                    });
                });
            });
        });

    },doLogin:(userDatal)=>{
        return new Promise(async(resolve,reject)=>{
            let loginst=false;
            let responce = {};
            let mail=await db.get().collection(collection.user).findOne({Email:userDatal.Email});
            if(mail){
                bcrypt.compare(userDatal.Password,mail.Password).then((status)=>{
                    if(status){
                        console.log('logged in');
                        loginst=true;
                        responce.user=mail;
                        responce.status=true;
                        resolve(responce);       
                    }else{
                        console.log('wrong password');
                        resolve({status:false});
                    }
                });
            }else{
                console.log('wrong email');
                resolve({status:false});
            }
        });
    }
};