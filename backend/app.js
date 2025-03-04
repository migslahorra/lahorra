const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://migsdev:migsdev112503@cluster0.tinq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
})

app.get("/api/posts", (req, res, next) => {
    const posts = [
    {
        id: "asdasas",
        title: "First server-side postjhg",
        content: "This is coming from the server"
    },
    {
        id: "asdasdasa",
        title: "Second server-side post",
        content: "This is coming from the server!"
    },
    ];

    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
    });
})

module.exports = app;