const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpnco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

client.connect(err => {
    const brandsCollection = client.db("creativeAgency").collection("brands");
    const portfolioCollection = client.db("creativeAgency").collection("portfolio");
    const adminsCollection = client.db("creativeAgency").collection("admins");
    const servicesCollection = client.db("creativeAgency").collection("services");
    const reviewsCollection = client.db("creativeAgency").collection("reviews");
    console.log('Connected to Database...');

    app.get('/brands', (req, res) => {
        brandsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/portfolio', (req, res) => {
        portfolioCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var icon = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ title, description, icon })
            .then(result => {
                res.send(result.insertedCount > 0);
        })
    })

    app.post('/addAdmin', (req, res) => {
        adminsCollection.insertOne(req.body)
        .then(result => {
            console.log(result.insertedCount > 0)
        })
    })
})



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
});