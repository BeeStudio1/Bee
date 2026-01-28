const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// --- Serveur keepAlive (pour UptimeRobot) ---
const keepAlive = require("./keepalive");
keepAlive();

// --- API Roblox ---
const { app } = require("./api");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API en ligne sur le port " + PORT));

// --- Client Discord ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- Chargement des commandes ---
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if (!command.data || !command.execute) {
    console.warn(`⚠️ La commande "${file}" est invalide et a été ignorée.`);
    continue;
  }

  client.commands.set(command.data.name, command);
  console.log(`✔️ Commande chargée : ${command.data.name}`);
}

// --- Gestion des interactions (slash commands) ---
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
      ephemeral: true
    });
  }
});

// --- Bot prêt ---
client.once("ready", () => {
  console.log(`🤖 Bot connecté en tant que ${client.user.tag}`);
});

// --- Connexion Discord ---
client.login(process.env.TOKEN);