const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Login = require("../middleware/Login");
const POSTS = mongoose.model("POSTS");
const USERS = mongoose.model("USERS");

router.get("/user/:id", Login, (req, res) => {
  USERS.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      POSTS.find({ postedby: req.params.id })
        .populate("postedby", "_id")
        .then((posts) => {
          res.status(200).json({ user, posts });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
});
router.put("/follows", Login, async (req, res) => {
    try {
      if (req.body.followid === req.user._id) {
        return res.status(422).json({ error: "You can't follow yourself" });
      }
  
      const userToUpdate = await USERS.findById(req.body.followid);
  
      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (userToUpdate.followers.includes(req.user._id)) {
        return res.status(422).json({ error: "You are already following this user" });
      }
  
      const updatedUser = await USERS.findByIdAndUpdate(
        req.body.followid,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      );
  
      await USERS.findByIdAndUpdate(
        req.user._id,
        {
          $push: { followings: req.body.followid },
        },
        { new: true }
      );
  
      res.json({ user: updatedUser });
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });
  
  router.put("/unfollows", Login, async (req, res) => {
    try {
      if (req.body.followid === req.user._id) {
        return res.status(422).json({ error: "You can't unfollow yourself" });
      }
  
      const userToUpdate = await USERS.findById(req.body.followid);
  
      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (!userToUpdate.followers.includes(req.user._id)) {
        return res.status(422).json({ error: "You are not following this user" });
      }
  
      const updatedUser = await USERS.findByIdAndUpdate(
        req.body.followid,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      );
  
      await USERS.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { followings: req.body.followid },
        },
        { new: true }
      );
  
      res.json({ user: updatedUser });
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });

 

  



module.exports = router;
