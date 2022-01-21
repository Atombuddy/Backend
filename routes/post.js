const express = require("express");
const app = express();
var pool = require("../db");
app.use(express.json());

var token = "secret";

module.exports = {
  post: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (token != "") {
        const id = await pool.query(
          "SELECT userid FROM userdata where jwt=$1",
          [token]
        );
        const currDate = await pool.query("select now() at time zone 'utc'");
        const postid = await pool.query("SELECT MAX(postid) FROM postdata");
        await pool.query(
          "INSERT INTO postdata (userid,posttitle,postdescription,createdon) VALUES($1,$2,$3,$4)",
          [id.rows[0].userid, title, description, currDate.rows[0].timezone]
        );
        res.json({
          PostID: postid.rows[0].max,
          Title: title,
          Description: description,
          CreatedTime: currDate.rows[0].timezone,
        });
      } else {
        res.json("Not Authenticated.");
      }
    } catch (err) {
      res.json(err.message);
    }
  },

  deletePost: async (req, res) => {
    try {
      var { id } = req.params;
      id = Number(id);
      if (token != "") {
        await pool.query("DELETE FROM postdata WHERE postid=$1", [id]);
        res.json("Success");
      } else {
        res.json("Not Authenticated");
      }
    } catch (err) {
      res.json(err.message);
    }
  },

  getPost: async (req, res) => {
    try {
      var { id } = req.params;
      id = Number(id);
      if (token != "") {
        const post = await pool.query(
          "SELECT postid from postdata WHERE postid=$1",
          [id]
        );
        const comments = await pool.query(
          "SELECT DISTINCT(comment) FROM commentdata WHERE postid=$1",
          [id]
        );
        const likes = await pool.query(
          "SELECT COUNT(*) FROM likedata WHERE postid=$1",
          [id]
        );
        var commentsarr = [];
        comments.rows.forEach(function (obj) {
          commentsarr.push(obj.comment);
        });
        res.json({ Likes: likes.rows[0].count, Comments: commentsarr });
      } else {
        res.json("Not Authenticated");
      }
    } catch (err) {
      res.json(err.message);
    }
  },

  getAllPosts: async (req, res) => {
    try {
      if (token != "") {
        const user = await pool.query(
          "SELECT userid from userdata WHERE jwt=$1",
          [token]
        );
        const query = await pool.query(
          "SELECT p.postid,p.posttitle,p.postdescription,p.createdon,COUNT(l.postid) Likes, string_agg(DISTINCT c.comment,', ') AS Postcomments FROM postdata p INNER JOIN likedata l ON p.postid=l.postid INNER join commentdata c ON l.postid=c.postid WHERE p.userid=$1 GROUP BY p.postid ORDER BY p.createdon",
          [user.rows[0].userid]
        );
        res.json(query.rows);
      } else {
        res.json("Not Authenticated.");
      }
    } catch (err) {
      res.json(err.message);
    }
  },
};
