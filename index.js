const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5000;

// Middel ware

app.use(cors());
app.use(express.json());
//DszvAsOKfDiCDZON
//tourismDb

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt5tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("TourismDB");
        const servicesCollection = database.collection("services");

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hitting the post", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
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