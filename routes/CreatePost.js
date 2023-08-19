const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Login = require("../middleware/Login");
const POSTS = mongoose.model("POSTS");
const USERS = mongoose.model("USERS");


router.get("/allposts", Login, (req, res) => {
  POSTS.find()
    .populate("postedby", "username email") 
    .then(posts => res.json(posts))
    .catch(err => console.log(err));
});

router.post("/createpost", Login, (req, res) => {
  const { body, photo1 } = req.body;
  if (!photo1 || !body) {
    return res.status(422).json({ error: "please add all fields" });
  }
  
  const post = new POSTS({
    body,
    photo: photo1,
    postedby: req.user._id
  });
  
  post
    .save()
    .then(result => {
      return res.json({ post: result });
    })
    .catch(err => {
      res.json(err);
    });
});


router.get("/myposts", Login, (req, res) => {
  POSTS.find({ postedby: req.user._id }) 
    .populate("postedby", "_id username")
    .then(myposts => {
      res.json(myposts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});


router.put('/likes', Login, async (req, res) => {
  try {
    const result = await POSTS.findByIdAndUpdate(
      req.body.postid,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(422).json(err);
  }
});


router.put('/unlikes', Login, async (req, res) => {
  try {
    const result = await POSTS.findByIdAndUpdate(
      req.body.postid,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(422).json(err);
  }
});





router.delete('/deleteposts/:postid', Login, async (req, res) => {
  try {
    const post = await POSTS.findOne({ _id: req.params.postid }).populate('postedby', '_id');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.postedby._id.toString() === req.user._id.toString()) {
      await POSTS.deleteOne({ _id: req.params.postid });
      return res.json({ message: 'Post successfully deleted' });
    } else {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});





module.exports = router;
