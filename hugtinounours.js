const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hugtinounours')
        .setDescription('Fait un câlin à Tinounours !'),

    async execute(interaction) {
        await interaction.reply('meow~');
    }
};
