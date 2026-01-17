const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const keepAlive = require("./keepalive");

keepAlive(); // Lance le serveur web pour UptimeRobot

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
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
