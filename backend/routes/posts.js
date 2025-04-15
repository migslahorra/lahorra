const express = require('express');
const Post = require('../models/post');
const multer = require("multer");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");  

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid Mime Type");
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage });

router.post("/", checkAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const url = req.protocol + '://' + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: `${url}/images/${req.file.filename}`
        });

        const createdPost = await post.save();

        res.status(201).json({
            message: "Post added successfully",
            post: {
                id: createdPost._id.toString(),
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    const pageSize = parseInt(req.query.pagesize, 10);  
    const currentPage = parseInt(req.query.currentpage, 10);
    
    if (!pageSize || !currentPage) {
        return res.status(400).json({ message: "Page size and current page are required" });
    }

    try {
        const postquery = Post.find();

        postquery.skip(pageSize * (currentPage - 1))
                 .limit(pageSize);

        const documents = await postquery;

        const count = await Post.countDocuments();

        res.status(200).json({
            message: "Posts fetched successfully",
            posts: documents,
            maxPosts: count
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", checkAuth, upload.single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }

    Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    }, { new: true })
    .then(updatedPost => {
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully", imagePath });
    })
    .catch(error => {
        res.status(500).json({ message: "Error updating post" });
    });
});

router.delete("/:id", checkAuth, async (req, res) => {
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

module.exports = router;
