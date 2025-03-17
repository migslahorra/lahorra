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

app.post("/api/posts", async (req, res, next) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });

        const createdPost = await post.save(); // Save to MongoDB

        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id.toString() // Send back the new ID
        });
    } catch (error) {
        console.error("Post creation error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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

app.get("/api/posts", async (req, res, next) => {
    try {
        const posts = await Post.find();  // Fetch all posts

        const mappedPosts = posts.map(post => ({
            id: post._id.toString(), // Convert MongoDB _id to string
            title: post.title,
            content: post.content
        }));

        res.status(200).json({ message: "Posts fetched successfully", posts: mappedPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/api/posts/:id", async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        }, { new: true });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/api/posts/:id", async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        }, { new: true });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/posts/:id", (req, res,next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        console.log(req.params.id);
        res.status(200).json({message: "Post deleted"});
        })
    });
module.exports = app;