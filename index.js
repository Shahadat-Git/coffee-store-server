const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('coffee server is running')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-server.g8zjk15.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();

        const coffeeCollections = client.db('coffeeDB').collection('coffees');

        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollections.find();

            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollections.findOne(query);
            res.send(result);
        })


        app.post('/coffees', async (req, res) => {
            const coffee = req.body;
            const result = await coffeeCollections.insertOne(coffee);
            res.send(result);
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const find = coffeeCollections.findOne(query);
            const result = await coffeeCollections.deleteOne(find);
            res.send(result);
        })

        app.put('/coffees/update/:id', async (req, res) => {
            const id = req.params.id;
            const LoadedData = req.body;
            const query = { _id: new ObjectId(id) };
            const coffee = {
                $set: {
                    name: LoadedData.name,
                    supplier: LoadedData.supplier,
                    category: LoadedData.category,
                    chef: LoadedData.chef,
                    taste: LoadedData.taste,
                    details: LoadedData.details,
                    photo: LoadedData.photo,
                }
            }
            const options = { upsert: true };
            const result = await coffeeCollections.updateOne(query, coffee, options);
            res.send(result);

        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server is running on port : ${port}`)
})