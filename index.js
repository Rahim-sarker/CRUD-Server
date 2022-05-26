const express = require('express')
const app = express();
const port = 5000
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json());


//DBname: mydbUser1
//pass: rznzUlDlk6n8NOwK
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://mydbUser1:rznzUlDlk6n8NOwK@cluster0.kfohm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db("DBRahim");
        const collection = database.collection("users");

        //Get API
        app.get('/users', async (req, res) => {
            const cursor = collection.find({});
            const users = await cursor.toArray()
            res.send(users)
        });

        //get for update

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await collection.findOne(query)
            console.log("Load users here", id);
            res.send(user);
        })

        //Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await collection.insertOne(newUser);
            console.log("Hitting the post", req.body)
            console.log("Inserted", result);
            res.send(result);
        });
        //Update User
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            console.log("Hit the update users", id);
            res.json(result);
        })
        //DELETE API

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await collection.deleteOne(query);
            console.log("Deleting id is", result)
            res.json(result);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Node Mongo CRUD Server is running");
})

app.listen(port, () => {
    console.log("My Server is running on the port", port)
})