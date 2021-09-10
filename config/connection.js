var mongoClient = require('mongodb').MongoClient;
var state ={db:null};


var url = "mongodb://localhost:27017/mydb";
var dbname ='shopping';

module.exports.connect=(done)=>{

    mongoClient.connect(url, function(err, db) {

        if (err) throw err;
        console.log("Database created!");
        state.db=db.db(dbname);

    });

    done();
}

module.exports.get=()=>{
    return state.db;
}