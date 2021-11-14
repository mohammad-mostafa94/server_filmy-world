const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();

//required middlware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

//Setting default port for the backend server
const PORT = process.env.PORT || 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyrw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {

        await client.connect();
        const database = client.db("filmy-db");
        const filmyCollection = database.collection("filmy");
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const personCollection = database.collection('person');
        console.log("database connected");

        // GET API for find multiple data.
        app.get("/filmy", async (req, res) => {
            const cursor = filmyCollection.find({});
            const filmy = await cursor.toArray();
            res.send(filmy);
        });

        // GET API for find single data.
        app.get("/film/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const oneFilm = await filmyCollection.findOne(query);
            res.send(oneFilm);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = usersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        // delete api
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteUser = await usersCollection.deleteOne(query);
            res.send(deleteUser)
        });

        //update status data
        app.put("/user/:id", async (req, res) => {
            const id = req.params.id;
            const updateStatus = "accepted";
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus,
                },
            };
            const updatedUsers = await usersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(updatedUsers);
        });



        app.put('/persons', async (req, res) => {
            const person = req.body;
            const filter = { email: person.email };
            const options = { upsert: true };
            const updateDoc = { $set: person };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // GET API for find multiple data.
        app.get("/reviews", async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });



        app.get('/person', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = personCollection.find(query);
            const admin = await cursor.toArray();
            res.json(admin);
        });


        // POST API for create single data
        app.post('/person', async (req, res) => {
            const user = req.body;
            const result = await personCollection.insertOne(user);
            res.json(result);
        });

        app.put('/person/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await personCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        app.put('/person', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { email: user.email, name: user.name } };
            const result = await personCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.get('/persons/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const person = await personCollection.findOne(query);
            let isAdmin = false;
            if (person?.role === "admin") {
                isAdmin = true;
            }
            console.log(isAdmin);
            res.json(isAdmin);
        });




        app.delete("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteUser = await usersCollection.deleteOne(query);
            res.send(deleteUser)
        });


        // GET API for find single data.
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const oneService = await filmyCollection.findOne(query);
            res.send(oneService);
        });


        // API single data updated
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    price: updateService.price
                }
            }
            const updatedService = await filmyCollection.updateOne(filter, updateDoc, options);
            res.json(updatedService);

        });








    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


//Test server page running
app.get('/', (req, res) => {
    res.send(`Film world, backend is running on port ${PORT}`)
})

// Console log for terminal for server listening
app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log(`Server listening on port ${PORT}`)
})

