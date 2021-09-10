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

    }
};