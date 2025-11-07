const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Importar lista de palabras desde archivo externo
const defaultWords = require('./words');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Variable to store public URL (ngrok, etc.)
let publicUrl = null;

// Function to get ngrok URL from API
async function getNgrokUrl() {
    try {
        const axios = require('axios');
        const response = await axios.get('http://127.0.0.1:4040/api/tunnels', { timeout: 1000 });
        const tunnels = response.data.tunnels;

        if (tunnels && tunnels.length > 0) {
            const httpsTunnel = tunnels.find(t => t.public_url.startsWith('https'));
            const url = httpsTunnel ? httpsTunnel.public_url : tunnels[0].public_url;
            if (url) {
                publicUrl = url;
                console.log('🌐 URL de ngrok detectada:', publicUrl);
                return url;
            }
        }
    } catch (error) {
        // ngrok no está corriendo o no está disponible
    }
    return null;
}

// Intentar detectar ngrok cada 5 segundos
setInterval(async () => {
    if (!publicUrl) {
        await getNgrokUrl();
    }
}, 5000);

// Detectar al inicio
setTimeout(() => getNgrokUrl(), 2000);

// Middleware to detect and store public URL from requests
app.use((req, res, next) => {
    // Get the host from headers (ngrok sets x-forwarded-host)
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedProto = req.headers['x-forwarded-proto'] || 'https';

    if (forwardedHost && !publicUrl) {
        publicUrl = `${forwardedProto}://${forwardedHost}`;
        console.log('🌐 URL pública detectada desde headers:', publicUrl);
    }
    next();
});

// API endpoint to get public URL
app.get('/api/public-url', async (req, res) => {
    // Intentar obtener de ngrok si no tenemos URL
    if (!publicUrl) {
        await getNgrokUrl();
    }

    const url = publicUrl || `http://${req.headers.host}`;
    res.json({ url });
});

// Route for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route for dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Game state
let gameState = {
    players: [],
    gameStarted: false,
    gameWord: '',
    impostorId: null,
    impostorIds: [], // Array for multiple impostors
    customWord: '',
    readyPlayers: new Set(),
    gameMode: 'single' // 'single' or 'multiple' impostors
};

// Photo registry - stores custom photos by playerName
// This persists across connections for the session
let playerPhotosRegistry = {};

// Statistics tracking
let gameStats = {
    totalGames: 0,
    totalImpostors: 0,
    gamesHistory: [], // Array of completed games
    uniqueWords: new Set(),
    sessionStartTime: new Date(),
    playerStats: {} // Track stats per player
};

// Function to start the game (global scope)
function startGameNow() {
    if (gameState.players.length < 3) {
        console.log('❌ No se puede iniciar: menos de 3 jugadores');
        return;
    }

    if (gameState.gameStarted) {
        console.log('⚠️ El juego ya está iniciado');
        return;
    }

    // Get custom word if any ready player set it
    const customWordInput = gameState.customWord || '';

    // Select word
    if (customWordInput && customWordInput.trim()) {
        gameState.gameWord = customWordInput.trim().toUpperCase();
    } else {
        gameState.gameWord = defaultWords[Math.floor(Math.random() * defaultWords.length)];
    }

    // Determine number of impostors based on game mode
    let numImpostors = 1;
    if (gameState.gameMode === 'multiple') {
        // 1 impostor for 3-5 players, 2 impostors for 6+ players
        numImpostors = gameState.players.length >= 6 ? 2 : 1;
    }

    // Randomly select impostor(s)
    gameState.impostorIds = [];
    const availableIndexes = [...Array(gameState.players.length).keys()];

    for (let i = 0; i < numImpostors; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndexes.length);
        const selectedIndex = availableIndexes[randomIndex];
        gameState.impostorIds.push(gameState.players[selectedIndex].id);
        availableIndexes.splice(randomIndex, 1);
    }

    // Keep backward compatibility
    gameState.impostorId = gameState.impostorIds[0];

    // Reset all players' revealed and ready states
    gameState.players.forEach(p => {
        p.revealed = false;
        p.ready = false;
    });

    gameState.gameStarted = true;

    // Track statistics
    gameStats.totalGames++;
    gameStats.totalImpostors += numImpostors;
    gameStats.uniqueWords.add(gameState.gameWord);

    // Track player participation
    gameState.players.forEach(p => {
        if (!gameStats.playerStats[p.name]) {
            gameStats.playerStats[p.name] = {
                gamesPlayed: 0,
                timesImpostor: 0
            };
        }
        gameStats.playerStats[p.name].gamesPlayed++;

        if (gameState.impostorIds.includes(p.id)) {
            gameStats.playerStats[p.name].timesImpostor++;
        }
    });

    // Get impostor names
    const impostorNames = gameState.impostorIds
        .map(id => gameState.players.find(p => p.id === id)?.name || 'Desconocido')
        .join(', ');

    // Store game start info for history
    gameState.currentGameStart = {
        timestamp: new Date(),
        word: gameState.gameWord,
        impostor: impostorNames,
        impostorId: gameState.impostorId,
        impostorIds: gameState.impostorIds,
        players: gameState.players.map(p => p.name),
        playerCount: gameState.players.length,
        gameMode: gameState.gameMode
    };

    console.log('✅ Juego iniciado!');
    console.log('📝 Palabra:', gameState.gameWord);
    console.log('🎭 Impostor(es):', impostorNames);
    console.log('👥 Jugadores:', gameState.players.length);
    console.log('🎮 Modo:', gameState.gameMode === 'multiple' ? 'Múltiples impostores' : 'Un impostor');

    // Notify all players that game has started
    io.emit('gameStarted', {
        totalPlayers: gameState.players.length
    });

    // Broadcast stats update
    broadcastStats();
}

// Function to broadcast stats to all monitors
function broadcastStats() {
    // Calculate session duration
    const sessionDuration = Math.floor((new Date() - gameStats.sessionStartTime) / 1000); // in seconds
    const hours = Math.floor(sessionDuration / 3600);
    const minutes = Math.floor((sessionDuration % 3600) / 60);
    const seconds = sessionDuration % 60;
    const sessionTime = hours > 0
        ? `${hours}h ${minutes}m`
        : minutes > 0
            ? `${minutes}m ${seconds}s`
            : `${seconds}s`;

    // Find player who has been impostor most times
    let mostImpostorPlayer = null;
    let maxImpostorTimes = 0;
    Object.entries(gameStats.playerStats).forEach(([name, stats]) => {
        if (stats.timesImpostor > maxImpostorTimes) {
            maxImpostorTimes = stats.timesImpostor;
            mostImpostorPlayer = name;
        }
    });

    const stats = {
        currentPlayers: gameState.players.length,
        totalGames: gameStats.totalGames,
        sessionTime: sessionTime,
        mostImpostor: mostImpostorPlayer ? `${mostImpostorPlayer} (${maxImpostorTimes})` : 'N/A',
        gameInProgress: gameState.gameStarted,
        players: gameState.players.map(p => ({
            name: p.name,
            playerNumber: p.playerNumber,
            ready: p.ready,
            avatar: p.avatar
        })),
        history: gameStats.gamesHistory.slice(-20) // Last 20 games
    };

    io.emit('statsUpdate', stats);
}

// Function to save game to history when it ends
function saveGameToHistory() {
    if (gameState.currentGameStart) {
        gameStats.gamesHistory.push({
            ...gameState.currentGameStart
        });

        // Keep only last 50 games
        if (gameStats.gamesHistory.length > 50) {
            gameStats.gamesHistory = gameStats.gamesHistory.slice(-50);
        }

        gameState.currentGameStart = null;
        broadcastStats();
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Nueva conexión:', socket.id);

    // Check if this is a monitoring connection from query params
    const isMonitorQuery = socket.handshake.query.isMonitor === 'true';
    let isMonitor = isMonitorQuery;

    if (isMonitorQuery) {
        console.log('📊 Conexión de monitoreo establecida (desde query)');
        // Send initial stats to monitor immediately
        broadcastStats();
    }

    socket.on('setMonitor', () => {
        if (!isMonitor) {
            isMonitor = true;
            console.log('📊 Conexión de monitoreo establecida (desde evento)');
            // Send initial stats to monitor
            broadcastStats();
        }
    });

    // Handle stats request from monitor
    socket.on('requestStats', () => {
        console.log('📊 Solicitud de stats recibida, isMonitor:', isMonitor);
        if (isMonitor) {
            // Calculate session duration
            const sessionDuration = Math.floor((new Date() - gameStats.sessionStartTime) / 1000); // in seconds
            const hours = Math.floor(sessionDuration / 3600);
            const minutes = Math.floor((sessionDuration % 3600) / 60);
            const seconds = sessionDuration % 60;
            const sessionTime = hours > 0
                ? `${hours}h ${minutes}m`
                : minutes > 0
                    ? `${minutes}m ${seconds}s`
                    : `${seconds}s`;

            // Find player who has been impostor most times
            let mostImpostorPlayer = null;
            let maxImpostorTimes = 0;
            Object.entries(gameStats.playerStats).forEach(([name, stats]) => {
                if (stats.timesImpostor > maxImpostorTimes) {
                    maxImpostorTimes = stats.timesImpostor;
                    mostImpostorPlayer = name;
                }
            });

            const stats = {
                currentPlayers: gameState.players.length,
                totalGames: gameStats.totalGames,
                totalImpostors: gameStats.totalImpostors,
                uniqueWords: gameStats.uniqueWords.size,
                sessionTime: sessionTime,
                mostImpostor: mostImpostorPlayer ? `${mostImpostorPlayer} (${maxImpostorTimes})` : 'N/A',
                gameInProgress: gameState.gameStarted,
                players: gameState.players.map(p => ({
                    name: p.name,
                    playerNumber: p.playerNumber,
                    ready: p.ready,
                    avatar: p.avatar
                })),
                history: gameStats.gamesHistory.slice(-20)
            };
            console.log('📤 Enviando stats al monitor:', stats);
            socket.emit('statsUpdate', stats);
        }
    });

    // Only process as player if not a monitor
    if (isMonitor) {
        // Skip player registration for monitors
        return;
    }

    // Get player name from query
    let playerName = socket.handshake.query.playerName || `Jugador ${gameState.players.length + 1}`;

    // Wait a bit to see if it's a monitor connection
    setTimeout(() => {
        if (isMonitor) return;

        // Validate player name
        const trimmedName = playerName.trim();

        // Check minimum length
        if (trimmedName.length < 3) {
            socket.emit('nameRejected', {
                message: 'El nombre debe tener al menos 3 caracteres'
            });
            socket.disconnect();
            console.log(`❌ Conexión rechazada: nombre muy corto "${trimmedName}"`);
            return;
        }

        // Check for duplicate names (case insensitive)
        const nameLower = trimmedName.toLowerCase();
        const duplicateName = gameState.players.find(p => p.name.toLowerCase() === nameLower);

        if (duplicateName) {
            socket.emit('nameRejected', {
                message: `El nombre "${trimmedName}" ya está en uso. Por favor elige otro nombre.`
            });
            socket.disconnect();
            console.log(`❌ Conexión rechazada: nombre duplicado "${trimmedName}"`);
            return;
        }

        // Name is valid, add player to game
        playerName = trimmedName; // Use trimmed version
        const playerNumber = gameState.players.length + 1;

        // Get avatar from query or use null (client will assign random)
        const avatarId = socket.handshake.query.avatarId || null;
        const avatarEmoji = socket.handshake.query.avatarEmoji || null;
        // customPhoto NO se recibe aquí, se enviará después via updateCustomPhoto

        console.log(`🎭 Avatar recibido del cliente ${playerName}:`, {
            avatarId,
            avatarEmoji
        });

        const player = {
            id: socket.id,
            playerNumber: playerNumber,
            name: playerName,
            revealed: false,
            ready: false,
            avatar: {
                id: avatarId,
                emoji: avatarEmoji,
                customPhoto: null // Se actualizará después si hay foto
            }
        };
        gameState.players.push(player);

        console.log(`✅ Jugador ${playerName} agregado con avatar:`, player.avatar);

        // Send current player info
        socket.emit('playerJoined', {
            playerId: socket.id,
            playerNumber: playerNumber,
            playerName: playerName,
            totalPlayers: gameState.players.length,
            avatar: player.avatar
        });

        // Enviar todas las fotos existentes al nuevo cliente
        if (Object.keys(playerPhotosRegistry).length > 0) {
            console.log(`📤 Enviando ${Object.keys(playerPhotosRegistry).length} fotos existentes a ${playerName}`);
            socket.emit('allPlayerPhotos', {
                photos: playerPhotosRegistry
            });
        }

        // Broadcast updated player count to all clients
        io.emit('updatePlayerCount', {
            totalPlayers: gameState.players.length
        });

        console.log(`✅ ${playerName} conectado (Jugador #${playerNumber}) - Total: ${gameState.players.length}`);
    }, 100);

    // Handle ready toggle
    socket.on('toggleReady', () => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (!player) {
            console.log('⚠️ toggleReady: Jugador no encontrado');
            return;
        }

        player.ready = !player.ready;

        // Broadcast ready states to all players
        const readyStates = gameState.players.map(p => ({
            playerId: p.id,
            playerNumber: p.playerNumber,
            playerName: p.name,
            ready: p.ready,
            avatar: p.avatar
        }));

        console.log('📤 Enviando readyStates:', JSON.stringify(readyStates, null, 2));

        io.emit('updateReadyStates', { readyStates });

        const readyCount = gameState.players.filter(p => p.ready).length;
        console.log(`Jugador ${player.playerNumber} ${player.ready ? 'listo' : 'no listo'} - Total listos: ${readyCount}/${gameState.players.length}`);

        // Check if all players are ready (minimum 3 players)
        const allReady = gameState.players.length >= 3 &&
                        gameState.players.every(p => p.ready);

        console.log(`Estado del juego - Jugadores: ${gameState.players.length}, Todos listos: ${allReady}, Juego iniciado: ${gameState.gameStarted}`);

        if (allReady && !gameState.gameStarted) {
            console.log('✅ ¡Todos los jugadores están listos! Iniciando juego en 1 segundo...');
            // Auto start game after short delay
            setTimeout(() => {
                // Double check they're still all ready
                const stillAllReady = gameState.players.length >= 3 &&
                                     gameState.players.every(p => p.ready);
                console.log(`Verificación final - Todos listos: ${stillAllReady}, Juego iniciado: ${gameState.gameStarted}`);

                if (stillAllReady && !gameState.gameStarted) {
                    console.log('🎮 Iniciando juego ahora...');
                    startGameNow();
                } else {
                    console.log('❌ Inicio de juego cancelado - Estado cambió');
                }
            }, 1000);
        }
    });

    // Handle custom word update
    socket.on('updateCustomWord', (data) => {
        gameState.customWord = data.customWord || '';
        console.log(`📝 Palabra personalizada actualizada: "${gameState.customWord || 'Aleatoria'}"`);

        // Broadcast to all clients including dashboard
        io.emit('customWordUpdated', {
            customWord: gameState.customWord
        });
    });

    // Handle custom photo update
    socket.on('updateCustomPhoto', (data) => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (player && data.customPhoto && data.playerName) {
            console.log(`📷 Recibida foto personalizada de ${data.playerName} (tamaño: ${Math.round(data.customPhoto.length / 1024)}KB)`);

            // Guardar en el registro global del servidor
            playerPhotosRegistry[data.playerName] = data.customPhoto;
            player.avatar.customPhoto = 'HAS_PHOTO'; // Solo un flag en el player

            console.log(`💾 Foto guardada en registro del servidor. Total fotos: ${Object.keys(playerPhotosRegistry).length}`);

            // Broadcast foto a TODOS los clientes (incluyendo al que la envió)
            console.log(`📤 Haciendo broadcast de foto de ${data.playerName} a todos los clientes`);
            io.emit('playerPhotoUpdated', {
                playerName: data.playerName,
                customPhoto: data.customPhoto
            });

            // También actualizar ready states
            const readyStates = gameState.players.map(p => ({
                playerId: p.id,
                playerNumber: p.playerNumber,
                playerName: p.name,
                ready: p.ready,
                avatar: {
                    ...p.avatar,
                    customPhoto: p.avatar.customPhoto === 'HAS_PHOTO' ? 'HAS_PHOTO' : null
                }
            }));

            io.emit('updateReadyStates', { readyStates });
        }
    });

    // Handle game mode update
    socket.on('updateGameMode', (data) => {
        if (data.gameMode === 'single' || data.gameMode === 'multiple') {
            gameState.gameMode = data.gameMode;
            console.log('🎮 Modo de juego cambiado a:', gameState.gameMode === 'multiple' ? 'Múltiples impostores' : 'Un impostor');

            // Broadcast game mode to all players
            io.emit('gameModeUpdated', {
                gameMode: gameState.gameMode
            });
        }
    });

    // Handle start game (deprecated but kept for compatibility)
    socket.on('startGame', (data) => {
        if (gameState.players.length < 3) {
            socket.emit('error', { message: '¡Necesitas al menos 3 jugadores!' });
            return;
        }

        // Select word
        if (data.customWord && data.customWord.trim()) {
            gameState.gameWord = data.customWord.trim().toUpperCase();
        } else {
            gameState.gameWord = defaultWords[Math.floor(Math.random() * defaultWords.length)];
        }

        // Randomly select impostor
        const randomIndex = Math.floor(Math.random() * gameState.players.length);
        gameState.impostorId = gameState.players[randomIndex].id;

        gameState.gameStarted = true;

        console.log('Juego iniciado!');
        console.log('Palabra:', gameState.gameWord);
        console.log('Impostor:', gameState.impostorId);

        // Notify all players that game has started
        io.emit('gameStarted', {
            totalPlayers: gameState.players.length
        });
    });

    // Handle reveal request
    socket.on('revealWord', () => {
        if (!gameState.gameStarted) {
            socket.emit('error', { message: 'El juego no ha comenzado' });
            return;
        }

        const player = gameState.players.find(p => p.id === socket.id);
        if (!player) {
            return;
        }

        player.revealed = true;

        // Check if this player is an impostor
        const isImpostor = gameState.impostorIds.includes(socket.id);
        if (isImpostor) {
            socket.emit('roleRevealed', {
                isImpostor: true,
                word: null,
                totalImpostors: gameState.impostorIds.length
            });
        } else {
            socket.emit('roleRevealed', {
                isImpostor: false,
                word: gameState.gameWord,
                totalImpostors: gameState.impostorIds.length
            });
        }

        // Check if all players have revealed
        const allRevealed = gameState.players.every(p => p.revealed);
        if (allRevealed) {
            console.log('✅ Todos los jugadores han revelado sus roles');

            // Reset ready states for the next game preparation
            gameState.players.forEach(p => {
                p.ready = false;
            });

            // Don't send the word yet, just notify that all have revealed
            io.emit('allRevealed', {
                word: gameState.gameWord
            });

            // Send initial empty ready states for reset
            const readyStates = gameState.players.map(p => ({
                playerId: p.id,
                playerNumber: p.playerNumber,
                playerName: p.name,
                ready: p.ready,
                avatar: p.avatar
            }));
            io.emit('updateResetReadyStates', { readyStates });
        }
    });

    // Handle word reveal request (after discussion)
    socket.on('revealWordRequest', () => {
        if (!gameState.gameStarted) {
            return;
        }

        // Reset ready states for the next game preparation
        gameState.players.forEach(p => {
            p.ready = false;
        });

        // Send the word to all players
        io.emit('finalWordRevealed', {
            word: gameState.gameWord
        });

        console.log('📝 Palabra revelada a todos los jugadores');

        // Send initial empty ready states for reset
        const readyStates = gameState.players.map(p => ({
            playerId: p.id,
            playerNumber: p.playerNumber,
            playerName: p.name,
            ready: p.ready,
            avatar: p.avatar
        }));
        io.emit('updateResetReadyStates', { readyStates });
    });

    // Handle reset game - now requires all players to be ready
    socket.on('resetGame', () => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (!player) {
            console.log('⚠️ resetGame: Jugador no encontrado');
            return;
        }

        player.ready = !player.ready;

        // Broadcast ready states for new game
        const readyStates = gameState.players.map(p => ({
            playerId: p.id,
            playerNumber: p.playerNumber,
            playerName: p.name,
            ready: p.ready,
            avatar: p.avatar
        }));

        io.emit('updateResetReadyStates', { readyStates });

        const readyCount = gameState.players.filter(p => p.ready).length;
        console.log(`🔄 Jugador #${player.playerNumber} ${player.ready ? 'listo' : 'no listo'} para nuevo juego - Total listos: ${readyCount}/${gameState.players.length}`);

        // Check if all players are ready for reset
        const allReady = gameState.players.every(p => p.ready);

        if (allReady) {
            console.log('✅ ¡Todos listos para nuevo juego! Reiniciando en 1 segundo...');
            setTimeout(() => {
                // Double check they're still all ready
                const stillAllReady = gameState.players.every(p => p.ready);

                if (stillAllReady) {
                    console.log('🔄 Reiniciando juego...');

                    // Save game to history before resetting
                    saveGameToHistory();

                    gameState.gameStarted = false;
                    gameState.gameWord = '';
                    gameState.impostorId = null;
                    gameState.customWord = '';
                    gameState.players.forEach(p => {
                        p.revealed = false;
                        p.ready = false;
                    });

                    io.emit('gameReset');
                    console.log('✅ Juego reiniciado - Volviendo al lobby');

                    // Broadcast updated stats
                    broadcastStats();
                } else {
                    console.log('❌ Reinicio cancelado - Estado cambió');
                }
            }, 1000);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (isMonitor) {
            console.log('🔌 Conexión de monitoreo cerrada');
            return;
        }

        const disconnectedPlayer = gameState.players.find(p => p.id === socket.id);
        if (!disconnectedPlayer) {
            console.log('⚠️ Jugador desconectado no encontrado en la lista');
            return;
        }

        console.log(`🔌 ${disconnectedPlayer.name} desconectado (Jugador #${disconnectedPlayer.playerNumber})`);

        // Remove player from list
        gameState.players = gameState.players.filter(p => p.id !== socket.id);

        // Renumber players
        gameState.players.forEach((p, index) => {
            p.playerNumber = index + 1;
        });

        console.log(`👥 Jugadores restantes: ${gameState.players.length}`);

        // If game was started and players are too few, reset
        if (gameState.gameStarted && gameState.players.length < 3) {
            console.log('⚠️ Menos de 3 jugadores, reiniciando juego...');
            gameState.gameStarted = false;
            gameState.gameWord = '';
            gameState.impostorId = null;
            gameState.customWord = '';
            gameState.players.forEach(p => {
                p.revealed = false;
                p.ready = false;
            });
            io.emit('gameReset');
        }

        // Broadcast updated player count to all clients
        io.emit('updatePlayerCount', {
            totalPlayers: gameState.players.length
        });

        // If in lobby, update ready states
        if (!gameState.gameStarted) {
            const readyStates = gameState.players.map(p => ({
                playerId: p.id,
                playerNumber: p.playerNumber,
                playerName: p.name,
                ready: p.ready,
                avatar: p.avatar
            }));
            io.emit('updateReadyStates', { readyStates });

            // Check if all remaining players are ready and can start
            const allReady = gameState.players.length >= 3 &&
                            gameState.players.every(p => p.ready);

            if (allReady) {
                console.log('✅ Después de desconexión, todos los jugadores restantes están listos. Iniciando juego en 1 segundo...');
                setTimeout(() => {
                    const stillAllReady = gameState.players.length >= 3 &&
                                         gameState.players.every(p => p.ready);
                    if (stillAllReady && !gameState.gameStarted) {
                        console.log('🎮 Iniciando juego...');
                        startGameNow();
                    }
                }, 1000);
            } else {
                console.log(`📊 Estado después de desconexión - Listos: ${gameState.players.filter(p => p.ready).length}/${gameState.players.length}`);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎮 Servidor IMPOSTOR corriendo en:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n📱 Para conectar desde otros dispositivos:`);
    console.log(`   1. Asegúrate de estar en la misma red WiFi`);
    console.log(`   2. Desde tu móvil, visita: http://[TU-IP-LOCAL]:${PORT}`);
    console.log(`   3. Para obtener tu IP local:`);
    console.log(`      - Windows: abre cmd y escribe "ipconfig"`);
    console.log(`      - Mac/Linux: abre terminal y escribe "ifconfig"`);
    console.log(`      - Busca la dirección IPv4 (ej: 192.168.1.X)\n`);
});
