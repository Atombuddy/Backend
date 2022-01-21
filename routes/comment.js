const express = require("express");
const app = express();
var pool = require("../db");
app.use(express.json());

var token = "secret";

module.exports = {
  comment: async (req, res) => {
    try {
      var { id } = req.params;
      const { comment } = req.body;
      id = Number(id);
      if (token != "") {
        const userId = await pool.query(
          "SELECT userid from userdata WHERE jwt=$1",
          [token]
        );
        await pool.query(
          "INSERT INTO commentdata (userid,postid,comment) VALUES($1,$2,$3)",
          [userId.rows[0].userid, id, comment]
        );
        const commentid = await pool.query(
          "SELECT MAX(commentid) FROM commentdata"
        );
        res.json(commentid.rows[0].max);
      } else {
        res.json("Not Authenticated");
      }
    } catch (err) {
      res.json(err.message);
    }
  },
};
