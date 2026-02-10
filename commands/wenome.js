const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wenome')
        .setDescription('A mystical Wenomechainsama experience'),

    async execute(interaction) {
        await interaction.reply('Wenomechainsama\nTumajarbisaun\nWifenlooof\nEselifterbraun');
    }
};