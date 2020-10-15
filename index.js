const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
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
    const ordersCollection = client.db("creativeAgency").collection("orders");
    const reviewsCollection = client.db("creativeAgency").collection("reviews");

    app.get('/brands', (req, res) => {
        brandsCollection.find({})
            .toArray((err, documents) => {
                if(err){
                    res.status(404).send('Error');
                }
                else{
                    res.send(documents);
                }
            })
    })

    app.get('/portfolio', (req, res) => {
        portfolioCollection.find({})
            .toArray((err, documents) => {
                if(err){
                    res.status(404).send('Error');
                }
                else{
                    res.send(documents);
                }
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                if(err){
                    res.status(404).send('Error');
                }
                else{
                    res.send(documents);
                }
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                if(err) {
                    res.status(404).send('Error');
                }
                else{
                    res.send(documents);
                }
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
        .toArray((err, documents) => {
            if(err) {
                res.status(404).send('Error');
            }
            else{
                res.send(documents);
            }
        })
    })

    app.post('/ordersByEmail', (req, res) => {
        ordersCollection.find({ email: req.body.email })
            .toArray((err, documents) => {
                if(err){
                    res.status(404).send('Error');
                }
                else{
                    res.send(documents);
                }
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
                if(result.insertedCount > 0){
                    res.send(result.insertedCount > 0);
                }
                else{
                    res.status(404).send('Error');
                }
            })
    })

    app.post('/addAdmin', (req, res) => {
        adminsCollection.insertOne(req.body)
            .then(result => {
                if(result.insertedCount > 0){
                    res.send(result.insertedCount > 0)
                }
                else{
                    res.status(404).send('Error');
                }
            })
    })

    app.post('/addOrder', (req, res) => {
        const orderInfo = req.body;
        const file = req.files.file;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        ordersCollection.insertOne({ ...orderInfo, image })
            .then(result => {
                if(result.insertedCount > 0) {
                    res.send(result.insertedCount > 0);
                }
                else{
                    res.status(404).send('Error');
                }
            })
    })

    app.post('/isAdmin', (req, res) => {
        adminsCollection.find({ email: req.body.email })
            .toArray((err, documents) => {
                if(!err){
                    res.send(documents.length > 0);
                }
                else{
                    res.status(404).send('Error');
                }
            })
    })

    app.post('/makeReview', (req, res) => {
        reviewsCollection.insertOne(req.body)
        .then(result => {
            if(result.insertedCount > 0) {
                res.send(result.insertedCount > 0)
            }
            else{
                res.status(404).send('Error');
            }
        })
    })

    app.patch('/updateOrder/:id', (req, res) => {
        ordersCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                if(result.modifiedCount > 0) {
                    res.send(result.modifiedCount > 0);                 
                }
                else{
                    res.status(404).send('Error');
                }
            })
    })
})

app.listen(port);