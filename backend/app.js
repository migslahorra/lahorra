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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.post("/api/posts", async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });

        const createdPost = await post.save();

        res.status(201).json({
            message: "Post added successfully",
            post: { id: createdPost._id.toString(), title: createdPost.title, content: createdPost.content }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/api/posts/:id", async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/posts/:id", async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = app;