const express = require("express");
const app = express();
app.use(express.json());

let playerStats = {}; // stockage temporaire

app.post("/stats", (req, res) => {
    const data = req.body;
    playerStats[data.username.toLowerCase()] = data;
    res.send("OK");
});

module.exports = { app, playerStats };
