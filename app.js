const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const fs = require("fs");
const usersData = require("./data/Users.json");
const postsData = require("./data/Posts.json");

app.use(bodyParser.json());

//lấy về dữ liệu của một user
app.get("/api/v1/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = usersData.find((user) => user.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

//lấy về dữ liệu của toàn bộ users
app.get("/api/v1/users", (req, res) => {
  res.json(usersData);
});

//thêm mới dữ liệu về 1 user
app.post("/api/v1/users", (req, res) => {
  const newUser = req.body;
  newUser.id = usersData.length + 1;
  usersData.push(newUser);
  saveData("Users.json", usersData);
  res.json(newUser);
});

//chỉnh sửa dữ liệu của 1 user: email
app.put("/api/v1/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedEmail = req.body.email;
  const user = usersData.find((user) => user.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.email = updatedEmail;
  saveData("Users.json", usersData);
  res.json(user);
});

//xoá dữ liệu về một user
app.delete("/api/v1/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const userIndex = usersData.findIndex((user) => user.id === parseInt(userId));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  usersData.splice(userIndex, 1);
  saveData("Users.json", usersData);
  res.json({ message: "User deleted successfully" });
});

//  lấy về dữ liệu của một post
app.get("/api/v1/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const post = postsData.find((post) => post.id === parseInt(postId));
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

//  lấy về dữ liệu của toàn bộ posts
app.get("/api/v1/posts", (req, res) => {
  res.json(postsData);
});

//  thêm mới dữ liệu về 1 post
app.post("/api/v1/posts", (req, res) => {
  const newPost = req.body;
  newPost.id = postsData.length + 1;
  postsData.push(newPost);
  saveData("Posts.json", postsData);
  res.json(newPost);
});

//  chỉnh sửa dữ liệu của 1 post
app.put("/api/v1/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const updatedPost = req.body;
  const post = postsData.find((post) => post.id === parseInt(postId));
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.title = updatedPost.title;
  post.content = updatedPost.content;
  saveData("Posts.json", postsData);
  res.json(post);
});

//  xoá dữ liệu về một post
app.delete("/api/v1/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const postIndex = postsData.findIndex((post) => post.id === parseInt(postId));
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }
  postsData.splice(postIndex, 1);
  saveData("Posts.json", postsData);
  res.json({ message: "Post deleted successfully" });
});

function saveData(fileName, data) {
  fs.writeFile(`./data/${fileName}`, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error saving data:", err);
    } else {
      console.log("Data saved successfully.");
    }
  });
}

//lấy về toàn bộ post của 1 user với id nhất định
app.get("/api/v1/users/:userId/posts", (req, res) => {
  const userId = req.params.userId;
  const userPosts = postsData.filter(
    (post) => post.userId === parseInt(userId)
  );
  res.json(userPosts);
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
