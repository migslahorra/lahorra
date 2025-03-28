const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 
const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://migsdev:migsdev112503@cluster0.tinq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Connected to database!'))
    .catch(err => console.error('Connection failed!', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "images"))); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;