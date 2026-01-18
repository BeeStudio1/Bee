const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();
const keepAlive = require("./keepalive");

keepAlive(); // Lance le serveur web pour UptimeRobot

const { app, playerStats } = require("./api");
const PORT = process.env.PORT || 3000;        
app.listen(PORT, () => console.log("API en ligne sur le port " + PORT));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Gestion des commandes slash
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hugtinounours") {
    await interaction.reply("meow~");
  }
});

client.on("ready", () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong !");
  }
});

client.login(process.env.TOKEN);
