const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hugtinounours')
        .setDescription('Do a hug for my cat Tinounours !'),

    async execute(interaction) {
        await interaction.reply('meow~');
    }
};
