var db = require('../config/connection');
var bcrypt = require('bcrypt');
const collection = require('../config/collection');
var objid = require('mongodb').ObjectId;
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
        return new Promise(async (resolve, reject) => {
            var ucoll =await  db.get().collection(collection.cart).findOne({ user: objid(uid) });
            if (ucoll) {

            } else {

                let cartoj = {
                    user: objid(uid),
                    product: [objid(pid)]
                }
                db.get().collection(collection.cart).insertOne(cartoj).then((responce) => {
                    resolve(responce);
                });
            }
        });
    }
};