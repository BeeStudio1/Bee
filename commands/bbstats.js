const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bbstats")
        .setDescription("Show stats of a player of bee's botdata")
        .addStringOption(option =>
            option.setName("user")
                .setDescription("Roblox username")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        // option name must match the one we defined above
        const pseudo = interaction.options.getString("user");

        try {
            // Récupérer l'ID du joueur Roblox
            // node-fetch is already a dependency; use global fetch or import it explicitly if needed
            const userResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames: [pseudo] })
            });

            const userData = await userResponse.json();
            
            if (!userData.data || userData.data.length === 0) {
                return interaction.editReply("❌ noen't found.");
            }

            const userId = userData.data[0].id;
            const username = userData.data[0].name;

            // Récupérer les stats du bot (en cache)
            let stats = null;
            try {
                const statsResponse = await fetch(`http://localhost:3000/stats/${pseudo}`);
                if (statsResponse.ok) {
                    stats = await statsResponse.json();
                }
            } catch (err) {
                console.error("Erreur récupération stats:", err);
            }

            // Si pas de stats en cache
            if (!stats) {
                return interaction.editReply(`ℹ️ Les stats de **${username}** (ID: ${userId}) ne sont actuellement pas disponibles.\n\n**Comment obtenir les stats:**\n1️⃣ Le joueur doit se connecter à votre jeu Roblox\n2️⃣ Les stats seront alors sauvegardées\n3️⃣ Réessayez la commande après\n\n💾 Les données sont maintenant persistantes et ne seront plus perdues au redémarrage du bot.`);
            }

            await interaction.editReply({
                embeds: [{
                    title: `📊 Stats de ${username}`,
                    color: 0x00A2FF,
                    thumbnail: { url: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png` },
                    fields: [
                        { name: "👤 User", value: `${username}`, inline: true },
                        { name: "🆔 ID", value: `${userId}`, inline: true },
                        { name: "⭐ Level", value: `${stats.level || "0"}`, inline: true },
                        { name: "💀 Deaths", value: `${stats.death || "0"}`, inline: true },
                        { name: "💰 Beebux", value: `${stats.beebux || "0"}`, inline: true },
                        { name: "🎯 XPLevel", value: `${stats.level_xp || "0"}`, inline: true },
                        { name: "⏱️ Time alive", value: `${stats.time_alive || "0"}s`, inline: true },
                        { name: "🏆 Best Time", value: `${stats.best_time || "0"}s`, inline: true },
                        { name: "🗺️ Map", value: `${stats.map || "N/A"}`, inline: true }
                    ]
                }]
            });
        } catch (error) {
            console.error("Erreur bbstats:", error);
            await interaction.editReply("❌ Erreur lors de la récupération des stats.");
        }
    }
};
