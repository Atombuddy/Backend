const express = require("express");
const app = express();
var pool = require("../db");
app.use(express.json());

var token ="secret"

module.exports={
  like:async (req, res) => {
    try {
      var { id } = req.params;
      id = Number(id);
      if (token != "") {
        const userId = await pool.query(
          "SELECT userid from userdata WHERE jwt=$1",
          [token]
        );
        await pool.query("INSERT INTO likedata (userid,postid) VALUES($1,$2)", [
          userId.rows[0].userid,
          id,
        ]);
        res.json("Success");
      } else {
        res.json("Not Authenticated.");
      }
    } catch (err) {
      res.json(err.message);
    }
  },
  
  dislike:async (req, res) => {
    try {
      var { id } = req.params;
      id = Number(id);
      if (token != "") {
        const userId = await pool.query(
          "SELECT userid from userdata WHERE jwt=$1",
          [token]
        );
        await pool.query("DELETE FROM likedata WHERE postid=$1 AND userid=$2", [
          id,
          userId.rows[0].userid,
        ]);
        res.json("Success");
      } else {
        res.json("Not Authenticated");
      }
    } catch (err) {
      res.json(err.message);
    }
  }
};