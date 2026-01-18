const { SlashCommandBuilder } = require("discord.js");
const { playerStats } = require("../api");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bbstats")
        .setDescription("Affiche les stats d'un joueur Roblox")
        .addStringOption(option =>
            option.setName("pseudo")
                .setDescription("Le pseudo Roblox")
                .setRequired(true)
        ),

    async execute(interaction) {
        const pseudo = interaction.options.getString("pseudo").toLowerCase();

        if (!playerStats[pseudo]) {
            return interaction.reply("Aucune stats trouvée pour ce joueur.");
        }

        const s = playerStats[pseudo];

        await interaction.reply({
            embeds: [{
                title: `Stats de ${s.username}`,
                color: 0x00A2FF,
                fields: [
                    { name: "Level", value: `${s.level}`, inline: true },
                    { name: "Deaths", value: `${s.deaths}`, inline: true },
                    { name: "Beebux", value: `${s.beebux}`, inline: true },
                    { name: "Time Alive", value: `${s.timeAlive}`, inline: true },
                    { name: "Map", value: `${s.map}`, inline: true },
                    { name: "Best Time", value: `${s.bestTime}`, inline: true }
                ]
            }]
        });
    }
};
