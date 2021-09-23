var db = require('../config/connection');
var bcrypt = require('bcrypt');
const collection = require('../config/collection');
var objid = require('mongodb').ObjectId;


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
    }

}