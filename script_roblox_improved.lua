-- ============================================================
-- SCRIPT POUR ENVOYER LES STATS AU DISCORD BOT (VERSION AMÉLIORÉE)
-- Ajoutez ce script à la fin de votre ServerScriptService
-- ============================================================

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- URL de votre bot (À VÉRIFIER!)
local BOT_URL = "https://bee-production-72de.up.railway.app"

-- Test de connexion
print("=" .. string.rep("=", 58) .. "=")
print("🤖 INITIALISATION - Script Stats Discord")
print("=" .. string.rep("=", 58) .. "=")
print("🔗 URL du bot: " .. BOT_URL)
print("⏰ Timestamp: " .. os.time())

-- Fonction pour tester la connexion au bot
local function testConnection()
	print("\n📡 Test de connexion au bot...")
	local success, response = pcall(function()
		return HttpService:GetAsync(BOT_URL .. "/stats/test", true)
	end)
	
	if success then
		print("✅ Connexion au bot réussie!")
		return true
	else
		print("❌ ERREUR: Impossible de se connecter au bot!")
		print("   Raison: " .. tostring(response))
		print("   Vérifiez que l'URL est correcte: " .. BOT_URL)
		return false
	end
end

-- Tester la connexion au démarrage
local botConnected = testConnection()

-- Fonction pour envoyer les stats avec retry
local function sendStatsToBot(player, retryCount)
	retryCount = retryCount or 0
	local maxRetries = 3
	
	print("\n📨 Envoi des stats pour: " .. player.Name)
	
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then
		warn("⚠️  Pas de leaderstats pour " .. player.Name)
		return
	end

	-- Récupérer toutes les stats
	local stats = {
		username = player.Name,
		user_id = player.UserId,
		level = leaderstats:FindFirstChild("level") and leaderstats.level.Value or 0,
		death = leaderstats:FindFirstChild("death") and leaderstats.death.Value or 0,
		beebux = leaderstats:FindFirstChild("beebux") and leaderstats.beebux.Value or 0,
		time_alive = leaderstats:FindFirstChild("time alive") and leaderstats["time alive"].Value or 0,
		best_time = leaderstats:FindFirstChild("best time") and leaderstats["best time"].Value or 0,
		map = leaderstats:FindFirstChild("map") and leaderstats.map.Value or "bb_mall",
		level_xp = leaderstats:FindFirstChild("level_xp") and leaderstats.level_xp.Value or 0,
		level_xp_goal = leaderstats:FindFirstChild("level_xp_goal") and leaderstats.level_xp_goal.Value or 0
	}

	print("📊 Stats à envoyer:")
	print("   Pseudo: " .. stats.username)
	print("   ID: " .. stats.user_id)
	print("   Level: " .. stats.level)
	print("   Beebux: " .. stats.beebux)

	-- Envoyer au bot
	local success, err = pcall(function()
		local jsonStats = HttpService:JSONEncode(stats)
		print("📤 Envoi en cours... (" .. #jsonStats .. " bytes)")
		
		local response = HttpService:PostAsync(
			BOT_URL .. "/stats",
			jsonStats,
			Enum.HttpContentType.ApplicationJson,
			false  -- Timeout désactivé
		)
		
		print("✅ Stats envoyées avec succès!")
		print("   Réponse: " .. response)
		return true
	end)

	if not success then
		print("❌ ERREUR lors de l'envoi: " .. tostring(err))
		if retryCount < maxRetries then
			print("🔄 Retry " .. (retryCount + 1) .. "/" .. maxRetries .. " dans 5 secondes...")
			task.wait(5)
			return sendStatsToBot(player, retryCount + 1)
		else
			print("❌ Impossible d'envoyer après " .. maxRetries .. " tentatives")
			return false
		end
	end
	
	return true
end

-- Quand un joueur se connecte
Players.PlayerAdded:Connect(function(player)
	print("\n👤 Joueur connecté: " .. player.Name .. " (ID: " .. player.UserId .. ")")
	
	-- Attendre que leaderstats soit créé
	local leaderstats = player:WaitForChild("leaderstats", 10)
	
	if leaderstats then
		print("✅ Leaderstats trouvé pour " .. player.Name)
		task.wait(2)
		sendStatsToBot(player)
	else
		warn("⚠️  Leaderstats non trouvé pour " .. player.Name)
	end
end)

-- Mettre à jour les stats régulièrement
local lastSendTimes = {}

RunService.Heartbeat:Connect(function()
	for _, player in pairs(Players:GetPlayers()) do
		if player and player:FindFirstChild("leaderstats") then
			local lastSend = lastSendTimes[player.UserId] or 0
			local currentTime = tick()
			
			-- Envoyer toutes les 30 secondes
			if (currentTime - lastSend) > 30 then
				print("\n⏱️  Mise à jour périodique pour " .. player.Name)
				sendStatsToBot(player)
				lastSendTimes[player.UserId] = currentTime
			end
		end
	end
end)

-- Log de départ
print("\n✅ Script de stats Discord chargé et actif!")
print("🔍 En attente de joueurs...")
print("=" .. string.rep("=", 58) .. "=\n")
