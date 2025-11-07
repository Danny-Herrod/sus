// Player info
let myPlayerId = null;
let myPlayerNumber = null;
let myPlayerName = null;
let myAvatar = null;
let totalPlayersCount = 0;
let hasRevealed = false;
let playersReadyState = [];
let isReady = false;
let socketConnected = false;

// Photo registry - stores custom photos for all players by playerName
let playerPhotos = {};

// Socket.IO connection - only connect after name is set
let socket = null;

// Audio Context for sound effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

// Initialize audio context (needs user interaction first)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

// Check if player has a saved name and avatar
function checkSavedName() {
    const savedName = localStorage.getItem('impostorPlayerName');
    const savedAvatarId = localStorage.getItem('impostorAvatarId');
    const savedAvatarEmoji = localStorage.getItem('impostorAvatarEmoji');

    // Always initialize avatar first
    if (savedAvatarId && savedAvatarEmoji) {
        myAvatar = {
            id: savedAvatarId,
            emoji: savedAvatarEmoji,
            customPhoto: null
        };
    } else {
        // Assign random avatar
        const randomAvatar = getRandomAvatar();
        myAvatar = {
            id: randomAvatar.id,
            emoji: randomAvatar.emoji,
            customPhoto: null
        };
    }

    updateSelectedAvatarDisplay();

    if (savedName) {
        myPlayerName = savedName;
        document.getElementById('playerName').value = savedName;
        // Auto-connect with saved name
        connectToGame();
    }

    // Initialize avatar grid
    initializeAvatarSelector();
}

// Initialize avatar selector grid
function initializeAvatarSelector() {
    const avatarGrid = document.getElementById('avatarGrid');
    if (!avatarGrid) {
        console.error('Avatar grid element not found');
        return;
    }

    avatarGrid.innerHTML = '';

    if (typeof defaultAvatars === 'undefined' || !defaultAvatars) {
        console.error('defaultAvatars is not defined');
        return;
    }

    defaultAvatars.forEach(avatar => {
        const avatarBtn = document.createElement('button');
        avatarBtn.style.cssText = `
            font-size: 2.5em;
            padding: 10px;
            border: 2px solid transparent;
            background: rgba(0, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        avatarBtn.textContent = avatar.emoji;
        avatarBtn.title = avatar.name;

        avatarBtn.onmouseover = () => {
            avatarBtn.style.borderColor = '#00ffff';
            avatarBtn.style.transform = 'scale(1.1)';
        };
        avatarBtn.onmouseout = () => {
            avatarBtn.style.borderColor = 'transparent';
            avatarBtn.style.transform = 'scale(1)';
        };

        avatarBtn.onclick = () => {
            selectAvatar(avatar);
        };

        avatarGrid.appendChild(avatarBtn);
    });
}

// Toggle avatar selector visibility
function toggleAvatarSelector() {
    const selector = document.getElementById('avatarSelector');
    selector.style.display = selector.style.display === 'none' ? 'block' : 'none';
}

// Select an avatar
function selectAvatar(avatar) {
    myAvatar = {
        id: avatar.id,
        emoji: avatar.emoji,
        customPhoto: null
    };
    updateSelectedAvatarDisplay();
    toggleAvatarSelector();

    // Save to localStorage
    localStorage.setItem('impostorAvatarId', avatar.id);
    localStorage.setItem('impostorAvatarEmoji', avatar.emoji);
}

// Update selected avatar display
function updateSelectedAvatarDisplay() {
    const display = document.getElementById('selectedAvatarDisplay');
    const nameDisplay = document.getElementById('selectedAvatarName');

    if (!display || !nameDisplay) {
        console.error('Avatar display elements not found');
        return;
    }

    if (!myAvatar) {
        console.error('myAvatar is not defined');
        return;
    }

    if (myAvatar.customPhoto) {
        display.innerHTML = `<img src="${myAvatar.customPhoto}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #00ffff;">`;
        nameDisplay.textContent = 'Foto personalizada';
    } else if (myAvatar.emoji) {
        display.textContent = myAvatar.emoji;
        const avatarData = getAvatarById(myAvatar.id);
        nameDisplay.textContent = avatarData ? avatarData.name : '';
    } else {
        console.error('Avatar has no emoji or photo');
    }
}

// Handle custom photo upload will be initialized in main DOMContentLoaded

// Submit name function
function submitName() {
    const nameInput = document.getElementById('playerName').value.trim();

    // Validate name is not empty
    if (!nameInput) {
        showNameError('Por favor ingresa tu nombre');
        return;
    }

    // Validate minimum length (3 characters)
    if (nameInput.length < 3) {
        showNameError('El nombre debe tener al menos 3 caracteres');
        return;
    }

    // Validate maximum length (20 characters)
    if (nameInput.length > 20) {
        showNameError('El nombre no puede tener más de 20 caracteres');
        return;
    }

    myPlayerName = nameInput;
    localStorage.setItem('impostorPlayerName', myPlayerName);

    playButtonClick();
    connectToGame();
}

// Show name error message
function showNameError(message) {
    const nameInput = document.getElementById('playerName');
    let errorEl = document.getElementById('nameError');

    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.id = 'nameError';
        errorEl.style.color = '#ff0080';
        errorEl.style.fontSize = '0.9em';
        errorEl.style.marginTop = '10px';
        nameInput.parentElement.appendChild(errorEl);
    }

    errorEl.textContent = message;
    nameInput.style.borderColor = '#ff0080';

    // Clear error after 3 seconds
    setTimeout(() => {
        if (errorEl) {
            errorEl.textContent = '';
            nameInput.style.borderColor = '#00ffff';
        }
    }, 3000);
}

// Connect to game server
function connectToGame() {
    if (socketConnected) return;

    // Initialize Socket.IO connection
    // NO enviamos customPhoto en query porque es muy grande
    socket = io({
        reconnection: false, // Disable auto-reconnection on name rejection
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        query: {
            playerName: myPlayerName,
            avatarId: myAvatar.id,
            avatarEmoji: myAvatar.emoji
            // customPhoto NO se envía aquí, es demasiado grande
        }
    });

    socketConnected = true;
    initializeSocketEvents();
    showScreen('lobbyScreen');
}

// Sound effect functions
function playButtonClick() {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function playCardFlip() {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.15);
}

function playImpostorReveal() {
    initAudio();
    // Dark, ominous sound
    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator1.frequency.value = 150;
    oscillator2.frequency.value = 200;
    oscillator1.type = 'sawtooth';
    oscillator2.type = 'sine';

    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator1.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);
    oscillator1.stop(audioCtx.currentTime + 0.5);
    oscillator2.stop(audioCtx.currentTime + 0.5);
}

function playWordReveal() {
    initAudio();
    // Magical, positive sound
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.2);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.3);
}

function playGameStart() {
    initAudio();
    // Ascending melody
    const times = [0, 0.1, 0.2];
    const frequencies = [400, 500, 700];

    times.forEach((time, index) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = frequencies[index];
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + time + 0.15);

        oscillator.start(audioCtx.currentTime + time);
        oscillator.stop(audioCtx.currentTime + time + 0.15);
    });
}

function playGameEnd() {
    initAudio();
    // Victory fanfare
    const times = [0, 0.15, 0.3, 0.45];
    const frequencies = [600, 700, 800, 1000];

    times.forEach((time, index) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = frequencies[index];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime + time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + time + 0.2);

        oscillator.start(audioCtx.currentTime + time);
        oscillator.stop(audioCtx.currentTime + time + 0.2);
    });
}

// Initialize socket event handlers
function initializeSocketEvents() {
    // Handle name rejection
    socket.on('nameRejected', (data) => {
        console.log('Nombre rechazado:', data.message);
        // Reset connection state
        socketConnected = false;
        socket = null;

        // Go back to name entry screen
        showScreen('nameEntryScreen');

        // Show error message
        showNameError(data.message);
    });

    socket.on('connect', () => {
        console.log('Conectado al servidor');
        document.getElementById('connectionStatus').textContent = '✓ Conectado';
        document.getElementById('connectionStatus').style.color = '#00ff80';
    });

    socket.on('disconnect', (reason) => {
        console.log('Desconectado del servidor:', reason);

        // If we're in name entry screen, don't show reconnecting message
        if (document.getElementById('nameEntryScreen').classList.contains('active')) {
            return;
        }

        document.getElementById('connectionStatus').textContent = '✗ Desconectado - Reconectando...';
        document.getElementById('connectionStatus').style.color = '#ff0080';
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log('Reconectado al servidor después de', attemptNumber, 'intentos');
        document.getElementById('connectionStatus').textContent = '✓ Reconectado';
        document.getElementById('connectionStatus').style.color = '#00ff80';
    });

    socket.on('reconnect_error', (error) => {
        console.error('Error de reconexión:', error);
    });

    socket.on('reconnect_failed', () => {
        console.error('Fallo al reconectar');
        document.getElementById('connectionStatus').textContent = '✗ Error de conexión';
        document.getElementById('connectionStatus').style.color = '#ff0080';
    });

    socket.on('playerJoined', (data) => {
        myPlayerId = data.playerId;
        myPlayerNumber = data.playerNumber;
        console.log('Eres el jugador #' + myPlayerNumber);

        // Enviar foto personalizada después de conectar (si existe)
        if (myAvatar && myAvatar.customPhoto) {
            console.log('📤 Enviando foto personalizada al servidor...');
            // Guardar mi propia foto en el registro
            playerPhotos[myPlayerName] = myAvatar.customPhoto;

            socket.emit('updateCustomPhoto', {
                playerName: myPlayerName,
                customPhoto: myAvatar.customPhoto
            });
        }
    });

    // Recibir todas las fotos existentes al conectar
    socket.on('allPlayerPhotos', (data) => {
        console.log('📦 Recibidas todas las fotos existentes:', Object.keys(data.photos).length);
        playerPhotos = { ...playerPhotos, ...data.photos };
        // Actualizar la visualización
        updateReadyDisplay();
        updateResetReadyDisplay();
    });

    // Recibir fotos de otros jugadores
    socket.on('playerPhotoUpdated', (data) => {
        console.log('📷 Foto recibida de:', data.playerName);
        playerPhotos[data.playerName] = data.customPhoto;
        // Actualizar la visualización
        updateReadyDisplay();
        updateResetReadyDisplay();
    });

    socket.on('updatePlayerCount', (data) => {
        totalPlayersCount = data.totalPlayers;
        document.getElementById('lobbyPlayerCount').textContent = totalPlayersCount;
        updateReadyButton();
    });

    socket.on('updateReadyStates', (data) => {
        playersReadyState = data.readyStates;

        // Find my ready state
        const myState = playersReadyState.find(p => p.playerId === myPlayerId);
        if (myState) {
            isReady = myState.ready;
        }

        updateReadyDisplay();
        updateReadyButton();
    });

    socket.on('updateResetReadyStates', (data) => {
        playersReadyState = data.readyStates;

        // Find my ready state
        const myState = playersReadyState.find(p => p.playerId === myPlayerId);
        if (myState) {
            isReady = myState.ready;
        }

        updateResetReadyDisplay();
    });

    socket.on('gameStarted', (data) => {
        playGameStart();
        totalPlayersCount = data.totalPlayers;

        document.getElementById('yourPlayerNumber').textContent = myPlayerNumber;
        document.getElementById('totalPlayers').textContent = totalPlayersCount;

        hasRevealed = false;
        isReady = false;
        playersReadyState = [];
        showScreen('gameScreen');
        resetRevealCard();
    });

    socket.on('roleRevealed', (data) => {
        console.log('roleRevealed recibido:', data);

        const card = document.getElementById('revealCard');
        card.className = 'reveal-card';
        card.onclick = null;

        if (data.isImpostor) {
            // This player is the impostor
            console.log('Soy el impostor!');
            // Usar el mismo sonido que jugador normal para no revelar el rol
            setTimeout(() => playWordReveal(), 100);

            const impostorMessage = data.totalImpostors > 1
                ? `¡TÚ ERES<br>IMPOSTOR!<br><span style="font-size: 0.6em; color: #00ffff;">(Hay ${data.totalImpostors} impostores)</span>`
                : '¡TÚ ERES EL<br>IMPOSTOR!';

            card.innerHTML = `
                <div class="card-icon">💀</div>
                <div class="impostor-text">${impostorMessage}</div>
            `;
            card.style.borderColor = '#ff0080';
            card.style.background = 'rgba(255, 0, 128, 0.1)';
        } else {
            // Regular player
            console.log('No soy el impostor, mi palabra:', data.word);
            setTimeout(() => playWordReveal(), 100);

            const impostorHint = data.totalImpostors > 1
                ? `<p style="color: #ffff00; font-size: 0.8em; margin-top: 10px;">⚠️ Hay ${data.totalImpostors} impostores</p>`
                : '';
            card.innerHTML = `
                <div class="card-icon">✨</div>
                <div class="card-content">${data.word}</div>
                ${impostorHint}
            `;
            card.style.borderColor = '#00ff80';
            card.style.background = 'rgba(0, 255, 128, 0.1)';
        }

        hasRevealed = true;
        document.getElementById('waitingMessage').style.display = 'block';
    });

    socket.on('finalWordRevealed', (data) => {
        console.log('finalWordRevealed recibido:', data);
        playWordReveal();
        document.getElementById('revealedWord').textContent = data.word;

        // Reset ready state for new game preparation
        isReady = false;
        playersReadyState = [];

        showScreen('revealScreen');
        // Update reset ready display
        updateResetReadyDisplay();
    });

    socket.on('allRevealed', (data) => {
        playGameEnd();
        // Store word for later reveal
        window.secretWord = data.word;

        // Reset ready state for new game preparation
        isReady = false;
        playersReadyState = [];

        setTimeout(() => {
            showScreen('discussionScreen');
            // Request initial reset ready states
            updateResetReadyDisplay();
        }, 2000);
    });

    socket.on('gameReset', () => {
        hasRevealed = false;
        isReady = false;
        playersReadyState = [];
        showScreen('lobbyScreen');
        resetRevealCard();
        document.getElementById('customWord').value = '';
        updateReadyButton();
    });

    socket.on('error', (data) => {
        alert(data.message);
    });
}

// Game functions
function toggleReady() {
    playButtonClick();
    socket.emit('toggleReady');
}

function startGame() {
    // This function is now deprecated but kept for compatibility
    toggleReady();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function resetRevealCard() {
    const card = document.getElementById('revealCard');
    card.className = 'reveal-card hidden';
    card.innerHTML = `
        <div class="card-icon">🎭</div>
        <div class="click-hint">Toca para revelar tu rol</div>
    `;
    card.onclick = revealWord;
    document.getElementById('waitingMessage').style.display = 'none';
}

function revealWord() {
    if (hasRevealed) return;

    console.log('Revelando palabra...');
    playCardFlip();
    socket.emit('revealWord');
}

function resetGame() {
    playButtonClick();
    socket.emit('resetGame');
}

function showRevealOptions() {
    console.log('Solicitando revelar palabra final...');
    playButtonClick();
    socket.emit('revealWordRequest');
}

// Update ready button state and text
function updateReadyButton() {
    const readyBtn = document.getElementById('readyBtn');
    if (!readyBtn) return;

    const readyCount = playersReadyState.filter(p => p.ready).length;

    if (isReady) {
        readyBtn.textContent = `✓ LISTO (${readyCount}/${totalPlayersCount})`;
        readyBtn.classList.add('ready');
    } else {
        readyBtn.textContent = `LISTO? (${readyCount}/${totalPlayersCount})`;
        readyBtn.classList.remove('ready');
    }

    // Show warning if not enough players
    const warningEl = document.getElementById('minPlayersWarning');
    if (warningEl) {
        if (totalPlayersCount < 3) {
            warningEl.style.display = 'block';
        } else {
            warningEl.style.display = 'none';
        }
    }
}

// Update ready display list
function updateReadyDisplay() {
    const readyListEl = document.getElementById('readyList');
    if (!readyListEl) return;

    console.log('🔍 updateReadyDisplay - playersReadyState:', playersReadyState);

    readyListEl.innerHTML = playersReadyState.map(player => {
        console.log('🔍 Player data:', player);
        console.log('🔍 Player avatar:', player.avatar);

        const icon = player.ready ? '✓' : '○';
        const className = player.ready ? 'ready' : '';
        const isMe = player.playerId === myPlayerId ? ' (Tú)' : '';
        const displayName = player.playerName || `Jugador #${player.playerNumber}`;

        // Get avatar display
        let avatarDisplay = '👤';

        // Primero buscar en el registro local de fotos
        const photoFromRegistry = playerPhotos[player.playerName];

        if (photoFromRegistry) {
            console.log('📷 Usando foto del registro para:', player.playerName);
            avatarDisplay = `<img src="${photoFromRegistry}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;">`;
        } else if (player.avatar) {
            console.log('✅ Player has avatar:', player.avatar);
            if (player.avatar.customPhoto && player.avatar.customPhoto !== 'HAS_PHOTO') {
                console.log('📷 Using custom photo from player.avatar');
                avatarDisplay = `<img src="${player.avatar.customPhoto}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;">`;
            } else if (player.avatar.emoji) {
                console.log('😀 Using emoji:', player.avatar.emoji);
                avatarDisplay = player.avatar.emoji;
            } else {
                console.log('⚠️ Avatar object exists but no emoji or photo');
            }
        } else {
            console.log('❌ No avatar for player:', displayName);
        }

        return `<div class="player-ready-item ${className}">${icon} ${avatarDisplay} ${displayName}${isMe}</div>`;
    }).join('');
}

// Update reset ready display for both screens
function updateResetReadyDisplay() {
    const readyCount = playersReadyState.filter(p => p.ready).length;
    const playerCount = playersReadyState.length || totalPlayersCount;

    const listHTML = `
        <div class="ready-counter">Jugadores listos: ${readyCount}/${playerCount}</div>
        ${playersReadyState.map(player => {
            const icon = player.ready ? '✓' : '○';
            const className = player.ready ? 'ready' : '';
            const isMe = player.playerId === myPlayerId ? ' (Tú)' : '';
            const displayName = player.playerName || `Jugador #${player.playerNumber}`;

            // Get avatar display
            let avatarDisplay = '👤';
            const photoFromRegistry = playerPhotos[player.playerName];

            if (photoFromRegistry) {
                avatarDisplay = `<img src="${photoFromRegistry}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;">`;
            } else if (player.avatar) {
                if (player.avatar.customPhoto && player.avatar.customPhoto !== 'HAS_PHOTO') {
                    avatarDisplay = `<img src="${player.avatar.customPhoto}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;">`;
                } else if (player.avatar.emoji) {
                    avatarDisplay = player.avatar.emoji;
                }
            }

            return `<div class="player-ready-item ${className}">${icon} ${avatarDisplay} ${displayName}${isMe}</div>`;
        }).join('')}
    `;

    // Update discussion screen
    const discussionResetReadyListEl = document.getElementById('discussionResetReadyList');
    if (discussionResetReadyListEl) {
        discussionResetReadyListEl.innerHTML = listHTML;
    }

    // Update reveal screen
    const resetReadyListEl = document.getElementById('resetReadyList');
    if (resetReadyListEl) {
        resetReadyListEl.innerHTML = listHTML;
    }

    const buttonText = isReady
        ? `✓ LISTO PARA NUEVO JUEGO (${readyCount}/${playerCount})`
        : `¿LISTO PARA NUEVO JUEGO? (${readyCount}/${playerCount})`;

    // Update button text for discussion screen
    const discussionResetBtn = document.getElementById('discussionResetBtn');
    if (discussionResetBtn) {
        discussionResetBtn.textContent = buttonText;
        if (isReady) {
            discussionResetBtn.classList.add('ready');
        } else {
            discussionResetBtn.classList.remove('ready');
        }
    }

    // Update button text for reveal screen
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.textContent = buttonText;
        if (isReady) {
            resetBtn.classList.add('ready');
        } else {
            resetBtn.classList.remove('ready');
        }
    }
}

// Function to compress image
function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = width * (maxHeight / height);
                        height = maxHeight;
                    }
                }

                // Create canvas and compress
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Make sure avatares.js is loaded
    if (typeof defaultAvatars === 'undefined') {
        console.error('avatares.js no está cargado correctamente');
        alert('Error: No se pudieron cargar los avatares. Por favor recarga la página.');
        return;
    }

    checkSavedName();

    // Handle custom photo upload
    const photoInput = document.getElementById('customPhoto');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('📷 Archivo original:', Math.round(file.size / 1024) + 'KB');

                // Comprimir imagen antes de guardar
                compressImage(file, 150, 150, 0.7).then(compressedDataUrl => {
                    console.log('📷 Imagen comprimida:', Math.round(compressedDataUrl.length / 1024) + 'KB');

                    myAvatar = {
                        id: 'custom-photo',
                        emoji: '📷', // Emoji de cámara como placeholder
                        customPhoto: compressedDataUrl
                    };
                    updateSelectedAvatarDisplay();

                    // Guardar en localStorage
                    localStorage.setItem('impostorAvatarId', 'custom-photo');
                    localStorage.setItem('impostorAvatarEmoji', '📷');
                    localStorage.setItem('impostorCustomPhoto', compressedDataUrl);
                }).catch(err => {
                    console.error('Error comprimiendo imagen:', err);
                    alert('Error al procesar la imagen. Por favor intenta con otra foto.');
                });
            }
        });
    }

    // Allow Enter key to submit name
    const nameInput = document.getElementById('playerName');
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitName();
            }
        });
    }
});
