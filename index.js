"use strict";

var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/views/");

app.use(express.static(process.cwd()));

app.get("/", function (req, res) {
    res.render("index");
});

app.use(function (req, res, next) {// jshint ignore:line
    res.status(404).json({error: "not found"})
});

app.listen(process.env.PORT || 3003);