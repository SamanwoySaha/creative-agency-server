const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpnco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('Connected to Database...');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
});