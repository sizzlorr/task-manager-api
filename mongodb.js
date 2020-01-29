// CRUD create, read, update, delete
const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.error('Unable to connect to Database!');
    }

    console.log('Connected correctly!');

    const db = client.db(databaseName);

    // db.collection('users').updateOne({ _id: new ObjectID('5e18547ccba7cb65c32d2112') }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    db.collection('users').deleteMany({
        age: 26
    }).then((res) => {
        console.log(res.modifiedCount);
    }).catch((err) => {
        console.log(err);
    });
});
