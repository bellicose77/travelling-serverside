const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// Middel ware

app.use(cors());
app.use(express.json());
//DszvAsOKfDiCDZON
//tourismDb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt5tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("TourismDB");
        const servicesCollection = database.collection("services");
        const cartCollection = database.collection("CartCollection");

        //get api

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        // cart information
        app.get('/myorder', async (req, res) => {
            const cursor = cartCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        // Get single services;
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);
            res.json(service);
        });


        //Post api

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hitting the post", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //post api

        app.post('/addtocart', async (req, res) => {
            const package = req.body;
            const result = await cartCollection.insertOne(package);
            res.json(result);
        });


        //UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    name: updatedService.name,
                    description: updatedService.description,
                    price: updatedService.price,
                    img: updatedService.img,
                    duration: updatedService.duration,
                    email: updatedUser.email
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })


        //delete oder

        app.delete('/deleteCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }


}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("This is home page");
});
app.listen(port, () => {
    console.log("Running in the port", port);
})