const express = require("express");
const app = express();
var pool = require("./db");
const jwt = require("jsonwebtoken");
const postRoute = require("./routes/post");
const followRoute = require("./routes/follow");
const likeRoute = require("./routes/like");
const commentRoute = require("./routes/comment");

app.use(express.json());

const PORT = process.env.PORT || 5000;

var token ="secret";

app.get("/",(req,res)=>{
  res.send("Welcome")
})

app.post("/api/authenticate", async (req, res) => {
  try {
    var { email, password } = req.body;
    email="abc@gmail.com"
    const user = await pool.query("SELECT * FROM userdata WHERE email=$1", [
      email,
    ]);

    if (user.rows.length) {
      const emailid = user.rows[0].email;
      const userpassword=user.rows[0].userpassword;
      const jsontoken = jwt.sign({ emailid }, "SECRET_KEY");
      if(emailid==email && userpassword==password){
        return res.json(jsontoken);
      }
      else{
        res.json("Invalid Credentials.")
      }
    } else {
      res.json("No Match Found");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/follow/:id", followRoute.follow);
app.post("/api/unfollow/:id", followRoute.unfollow);

app.get("/api/user", async (req, res) => {
  try {
    if (token != "") {
      const name = await pool.query(
        "SELECT username FROM userdata WHERE jwt=$1",
        [token]
      );
      const followerid = await pool.query(
        "SELECT userid from userdata WHERE jwt=$1",
        [token]
      );
      const follower = await pool.query(
        "SELECT COUNT(*) FROM followdata WHERE followingid=$1",
        [followerid.rows[0].userid]
      );
      const following = await pool.query(
        "SELECT COUNT(*) FROM followdata WHERE followerid=$1",
        [followerid.rows[0].userid]
      );
      res.json({
        name: name.rows[0].username,
        followers: follower.rows[0].count,
        followings: following.rows[0].count,
      });
    } else {
      res.json("Not Authenticated");
    }
  } catch (err) {
    res.json(err.message);
  }
});

app.post("/api/posts", postRoute.post);

app.delete("/api/posts/:id", postRoute.deletePost);

app.post("/api/like/:id", likeRoute.like);

app.post("/api/unlike/:id", likeRoute.dislike);

app.post("/api/comment/:id", commentRoute.comment);

app.get("/api/posts/:id", postRoute.getPost);

app.get("/api/all_posts", postRoute.getAllPosts);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
