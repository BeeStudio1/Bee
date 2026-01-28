const { SlashCommandBuilder } = require("discord.js");

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
        await interaction.deferReply();
        const pseudo = interaction.options.getString("pseudo");

        try {
            // Récupérer l'ID du joueur Roblox
            const userResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames: [pseudo] })
            });

            const userData = await userResponse.json();
            
            if (!userData.data || userData.data.length === 0) {
                return interaction.editReply("❌ Joueur Roblox introuvable.");
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
                        { name: "👤 Pseudo Roblox", value: `${username}`, inline: true },
                        { name: "🆔 ID", value: `${userId}`, inline: true },
                        { name: "⭐ Level", value: `${stats.level || "0"}`, inline: true },
                        { name: "💀 Décès", value: `${stats.death || "0"}`, inline: true },
                        { name: "💰 Beebux", value: `${stats.beebux || "0"}`, inline: true },
                        { name: "🎯 XP du Level", value: `${stats.level_xp || "0"}`, inline: true },
                        { name: "⏱️ Temps en vie", value: `${stats.time_alive || "0"}s`, inline: true },
                        { name: "🏆 Meilleur temps", value: `${stats.best_time || "0"}s`, inline: true },
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
