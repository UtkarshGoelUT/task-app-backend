const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const url = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();
console.log(id);

MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect');
    }
    console.log('connected');
    const db = client.db(databaseName);

    db.collection('tasks').updateMany({}, {
        $set: {
            completed: true
        }
    }).then(
        (result) => {
            console.log(result);
        }
    ).catch((error) => {
        console.log(error);
    })

});