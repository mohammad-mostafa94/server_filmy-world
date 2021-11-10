const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')


//connecting to my cluster database online
// mongoose.connect('mongodb+srv://username:password@clustername.elei8.mongodb.net/databasename?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });


const app = express()

//required middlware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

//Setting default port for the backend server
const PORT = process.env.PORT || 5000


//Test server page running
app.get('/', (req, res) => {
    res.send(`race zone bike, backend is running on port ${PORT}`)
})

// Console log for terminal for server listening
app.listen(PORT, (err) => {
    if(err) return console.log(err);
    console.log(`Server listening on port ${PORT}`)
})