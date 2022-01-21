const express = require("express");
const app = express();
const pool = require("../db");
app.use(express.json());

var token ="secret"

module.exports={
    follow:async (req, res) => {
        try {
          var { id } = req.params;
          id = Number(id);
          if (token != "") {
            const followerid = await pool.query(
              "SELECT userid from userdata WHERE jwt=$1",
              [token]
            );
            await pool.query(
              "UPDATE followdata SET followingid=$1 WHERE followerid=$2",
              [id, followerid.rows[0].userid]
            );
            res.json("Success");
          } else {
            res.json("Not Authenticated.");
          }
        } catch (err) {
          res.json(err.message);
        }
      },

      unfollow:async (req, res) => {
        try {
          var { id } = req.params;
          id = Number(id);
          if (token != "") {
            const followerid = await pool.query(
              "SELECT userid from userdata WHERE jwt=$1",
              [token]
            );
            await pool.query(
              "DELETE FROM followdata WHERE followingid=$1 AND followerid=$2",
              [id, followerid.rows[0].userid]
            );
            res.json("Success");
          } else {
            res.json("Not Authenticated");
          }
        } catch (err) {
          res.json(err.message);
        }
      }
};