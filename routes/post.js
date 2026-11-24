const express = require('express');
const router = express.Router();
const auth = require("../auth");
const { verify, verifyOwnerOrAdmin } = auth;

const postController = require('../controllers/post');

router.post("/add-post", verify, postController.addPost);
router.get("/all", verify, postController.getAll);
router.get("/:id", verify, postController.getPost);
router.patch("/update/:id", verify, verifyOwnerOrAdmin, postController.updatePost);
router.delete("/delete/:id", verify, verifyOwnerOrAdmin, postController.deletePost);

//for comments
router.patch('/addComment/:id', verify, postController.addComment);


module.exports = router;