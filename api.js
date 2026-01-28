const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());

let playerStats = {}; // stockage temporaire
const statsFile = path.join(__dirname, "player_stats.json");

// Charger les stats du fichier au démarrage
if (fs.existsSync(statsFile)) {
    try {
        playerStats = JSON.parse(fs.readFileSync(statsFile, "utf8"));
    } catch (err) {
        console.warn("Erreur lecture player_stats.json:", err);
    }
}

// Sauvegarder les stats dans un fichier
function saveStats() {
    fs.writeFileSync(statsFile, JSON.stringify(playerStats, null, 2));
}

// Recevoir les stats du jeu Roblox
app.post("/stats", (req, res) => {
    const data = req.body;
    playerStats[data.username.toLowerCase()] = data;
    saveStats(); // Persister les données
    res.send("OK");
});

// Récupérer les stats (pour le bot)
app.get("/stats/:username", (req, res) => {
    const username = req.params.username.toLowerCase();
    if (playerStats[username]) {
        res.json(playerStats[username]);
    } else {
        res.status(404).json({ error: "Stats non trouvées" });
    }
});

// Endpoint pour que le jeu récupère les stats d'un joueur (offline)
app.get("/get-player-stats/:userId", (req, res) => {
    const userId = req.params.userId;
    // Chercher le joueur par ID
    for (const [username, stats] of Object.entries(playerStats)) {
        if (stats.user_id == userId) {
            return res.json(stats);
        }
    }
    res.status(404).json({ error: "Joueur non trouvé" });
});

module.exports = { app, playerStats };
