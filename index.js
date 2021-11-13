const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express()

//required middlware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

//Setting default port for the backend server
const PORT = process.env.PORT || 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyrw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client =  new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {

    await client.connect();
    const database = client.db("filmy-db");
    const filmyCollection = database.collection("filmy");
    const usersCollection = database.collection('users');
    console.log("database connected");

    // GET API for find multiple data.
app.get("/filmy", async(req, res) => {
    const cursor = filmyCollection.find({});
    const filmy = await cursor.toArray();
    res.send(filmy);
});

// GET API for find single data.
app.get("/film/:id", async(req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id)};
    const oneFilm = await filmyCollection.findOne(query);
    res.send(oneFilm);
    });

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.json(result);
    });



app.get('/user', async (req,res)=>{
    const email = req.query.email;
    const query = {email:email};
    const cursor = usersCollection.find(query);
    const orders = await cursor.toArray();
    res.json(orders);
});



    app.post('/products', async (req,res)=>{
        const product = req.body;
        const result = await filmyCollection.insertOne(product);
        res.json(result);
    });

    
// GET API for find multiple data.
app.get("/services", async(req, res) => {
    const cursor = servicesCollection.find({});
    const services = await cursor.toArray();
    res.send(services);
});

// GET API for find single data.
app.get("/service/:id", async(req, res) => {
const id = req.params.id;
const query = { _id: ObjectId(id)};
const oneService = await servicesCollection.findOne(query);
res.send(oneService);
});


// POST API for create single data
app.post("/service", async(req, res) => {
const service = req.body;
const singleService = await  servicesCollection.insertOne(service);
res.json(singleService);
});

// API single data updated
app.put("/update/:id", async(req, res) => {
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
const updatedService = await servicesCollection.updateOne(filter, updateDoc, options);
res.json(updatedService);

});

// delete api
app.delete("/service/:id", async(req, res) => {
const id = req.params.id;
const query = { _id: ObjectId(id) };
const deleteUser = await  servicesCollection.deleteOne(query);
res.send(deleteUser)
});


    


        app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    });


    app.put('/users', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
    });


    app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
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
    if(err) return console.log(err);
    console.log(`Server listening on port ${PORT}`)
})


// app.post("/userInfo", async(req, res) => {
// const user = req.body;
// const singleUser = await userInfoCollection.insertOne(user);
// res.json(singleUser);
// });

// app.get("/userInfo/:id", async(req, res) => {
// const id = req.params.id;
// const query = { _id: ObjectId(id)};
// const findService = await userInfoCollection.findOne(query);
// res.send(findService)
// });

// app.get("/usersInfo", async(req, res) => {
// const cursor = userInfoCollection.find({});
// const usersInfo = await cursor.toArray();
// res.send(usersInfo);
// });
