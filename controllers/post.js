const Post = require('../models/Post.js');
const { errorHandler } = require("../auth.js");


module.exports.addPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = new Post({
            title: title,
            content: content,
            author: req.user?.id || req.user?._id
        });

        const result = await newPost.save();
        return res.status(201).send(result);

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "email");
    return res.status(200).json(posts);
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "email")
      .populate("comments.userId", "email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updatePost = async (req, res) => {
    try {
        if(req.user.isAdmin){
            return res.status(403).send({
                message: "Only the author can edit this post"
            })
        }
        const id = req.params.id;
        const { title, content } = req.body;      

        let updatedPost = {
            title: title,
            content: content
        }

        const result = await Post.findByIdAndUpdate(
            id,
            updatedPost,
            {new: true, runValidators: true}
        )

        if (result){
            return res.status(200).send({
                message: "Post updated successfully",
                updatedPost: result
            })
        }

        return res.status(404).send({
            message: "Post not found"
        });


    } catch (error) {
        return errorHandler(err, req, res);
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).send({ message: "Post ID is required in URL parameter" });
        }

        const deletedPost = await Post.findByIdAndDelete(id);
        if(deletedPost){
            return res.status(200).send({
            message: "Post deleted successfully"
            });
        }
        return res.status(404).send({ message: "Post not found" });
    } catch (error) {
        return errorHandler(error, req, res);
    }
}

module.exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id; 
        const newComment = {
            userId: req.user?.id || req.user?._id,
            comment: req.body.comment
        };

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        post.comments.push(newComment);

        const updatedPost = await post.save();
        return res.status(200).send({
            message: "Comment added successfully",
            updatedPost: updatedPost
        });
    } catch (err) {
        return errorHandler(err, req, res);
    }
};