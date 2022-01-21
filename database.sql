CREATE DATABASE API;

CREATE TABLE "userdata" (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    userpassword VARCHAR(255),
    jwt VARCHAR(256),
    UNIQUE(username,email)
);

CREATE TABLE "followdata" (
    followid SERIAL PRIMARY KEY,
    followerid INT,
    followingid INT
);

CREATE TABLE "likedata" (
    likeid SERIAL PRIMARY KEY,
    userid INT REFERENCES userdata(userid) ON DELETE CASCADE,
    postid INT REFERENCES postdata(postid) ON DELETE CASCADE
);

CREATE TABLE "commentdata" (
    commentid SERIAL PRIMARY KEY,
    userid INT REFERENCES userdata(userid) ON DELETE CASCADE,
    postid INT REFERENCES postdata(postid) ON DELETE CASCADE,
    comment VARCHAR(255)
);

CREATE TABLE "postdata" (
    postid SERIAL PRIMARY KEY,
    userid INT REFERENCES userdata(userid) ON DELETE CASCADE,
    posttitle VARCHAR(255),
    postdescription VARCHAR(255),
    createdon TIMESTAMPTZ
);


INSERT INTO userdata (username,email,userpassword,jwt) VALUES ('nazeer','abc@gmail.com','abcd','secret');
INSERT INTO userdata (username,email,userpassword,jwt) VALUES ('xyz','xyz@gmail.com','xyz','secret');


