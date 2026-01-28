const express = require("express");

async function keepAlive() {
  const fetch = (await import("node-fetch")).default;
  const app = express();

  app.get("/", (req, res) => {
    res.send("Bot is alive");
  });

  // Serveur keepAlive sur un port différent de ton API
  app.listen(8081, () => {
    console.log("KeepAlive server running");
  });

  // Auto-ping toutes les 4 minutes
  setInterval(() => {
    fetch("https://bee-production-72de.up.railway.app").catch(() => {});
  }, 4 * 60 * 1000);
}

module.exports = keepAlive;