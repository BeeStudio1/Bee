const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snapgen")
    .setDescription("Generate a user they want do her snapscore."),

  async execute(interaction) {
    // Génération d'un username aléatoire
    const random = Math.random().toString(36).substring(2, 8);
    const username = `snap_${random}`;

    // Chemin du fichier de liste
    const filePath = path.join(__dirname, "..", "snaplist.json");

    // Charger ou créer la liste
    let list = [];
    if (fs.existsSync(filePath)) {
      try {
        list = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (err) {
        console.error("Erreur lecture snaplist.json :", err);
      }
    }

    // Ajouter le username
    list.push(username);

    // Sauvegarder la liste
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));

    // Réponse au user
    await interaction.reply({
      content: `🎉 **Ton username généré :** \`${username}\`\nIl a été ajouté à la liste.`,
      ephemeral: true
    });
  }
};
