const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wenome")
        .setDescription("wenomechainsame tumajarbisaun wifenloff eibelistesbraun"),

    async execute(interaction) {
        await interaction.reply("wenomechainsame tumajarbisaun wifenloff eibelistesbraun");
    },
};
