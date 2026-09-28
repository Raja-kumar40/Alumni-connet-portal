const express = require("express");

const router = express.Router();


router.get("/", (req, res) => {
    res.render("index");
});


router.get("/about", (req, res) => {
    res.render("about/about");
});


router.get("/vision", (req, res) => {
    res.render("about/vision");
});


router.get("/chairman", (req, res) => {
    res.render("about/chairman");
});


router.get("/director", (req, res) => {
    res.render("about/director");
});


router.get("/faculty", (req, res) => {
    res.render("about/faculty");
});


router.get("/message/alumni", (req, res) => {
    res.render("message/alumni");
});


router.get("/message/student", (req, res) => {
    res.render("message/student");
});


router.get("/message/other", (req, res) => {
    res.render("message/other");
});


router.get("/messages", (req, res) => {
    res.render("messages");
});


module.exports = router;