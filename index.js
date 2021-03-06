const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;

// Middle ware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uv3sk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("CarRepair2");
        const serviceCollection = database.collection("services2");

        // POST(SEND) API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service)
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        // GET API

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get single API


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })


        // DELETE API

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })


    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!Starting genius server')
})

app.get('/hello', (req, res) => {
    res.send('Hi there this for heroku test purpose')
})

app.listen(port, () => {
    console.log("starting genius server", port)
})



/*
one time :
1. heroku ac login
2. heroku software install]

Every Project

1. git init
2. git ignore(node_module, .env)
3. push everything to git. 
4. make sure you have this script "start": "node index.js"
5. make sure put process.env.PORT in front of your port number 
6.heroku login
7. heroku create(only one time for a project)
8. command : git push heroku main
--------

in case of update

1. git add , git commit -m, git push 
2. save Everything 
3. check locally
4. git push heroku main
*/