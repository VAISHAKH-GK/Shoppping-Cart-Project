var MongoClient = require('mongodb').MongoClient;
var state ={db:null};


var url = "mongodb://localhost:27017/mydb";

module.exports.connect=(done)=>{

    MongoClient.connect(url, function(err, db) {

        if (err) throw err;
        console.log("Database created!");
        state.db=db.db(dname);

    });

    done();

}

module.exports.get=()=>{
    return state.db;
}