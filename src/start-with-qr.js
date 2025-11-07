const { spawn } = require('child_process');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');
const ora = require('ora');
const io = require('socket.io-client');
const readline = require('readline');
const killPort = require('../scripts/kill-port');

// Colores personalizados
const neonCyan = gradient(['#00ffff', '#00ccff']);
const neonPink = gradient(['#ff0080', '#ff00ff']);
const fireGradient = gradient(['#ff0080', '#ff6b00', '#ffff00']);
const oceanGradient = gradient(['#00ffff', '#0080ff', '#0040ff']);

console.clear();

// Función para mostrar el logo animado
function showLogo() {
    return new Promise((resolve) => {
        figlet('IMPOSTOR', {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, (err, data) => {
            if (err) {
                console.log(gradient.pastel.multiline('IMPOSTOR'));
                resolve();
                return;
            }
            console.log(neonCyan(data));
            console.log(neonPink('                    🎭  EL JUEGO DEL ENGAÑO  🎭\n'));
            resolve();
        });
    });
}

// Diseño de caja bonito
function box(text, color = chalk.cyan) {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const topBottom = '═'.repeat(maxLength + 4);

    console.log(color('╔' + topBottom + '╗'));
    lines.forEach(line => {
        const padding = ' '.repeat(maxLength - line.length);
        console.log(color('║  ') + line + padding + color('  ║'));
    });
    console.log(color('╚' + topBottom + '╝'));
}

let serverProcess;
let ngrokProcess;
let ngrokUrl = null;
let playerCount = 0;
let socket = null;
let playerBoxStartLine = 0; // Línea donde empieza la cajita de jugadores

// Función para limpiar procesos al salir
function cleanup() {
    console.log('\n');
    const spinner = ora({
        text: chalk.red.bold('Cerrando servidor...'),
        spinner: 'dots12'
    }).start();

    setTimeout(() => {
        spinner.succeed(chalk.green('Servidor detenido correctamente'));
        console.log(fireGradient('\n👋 ¡Hasta la próxima partida!\n'));
        if (socket) socket.disconnect();
        if (serverProcess) serverProcess.kill();
        if (ngrokProcess) ngrokProcess.kill();
        process.exit();
    }, 1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Función principal
(async () => {
    await showLogo();

    // Primero limpiar el puerto 3000
    console.log(chalk.cyan('🔧 Limpiando puerto 3000...'));
    killPort();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(chalk.green('✓ Puerto 3000 libre\n'));

    // Animación de inicio
    const steps = [
        { text: 'Verificando dependencias...', delay: 500 },
        { text: 'Iniciando servidor local...', delay: 800 },
        { text: 'Creando túnel público...', delay: 1000 },
        { text: 'Generando código QR...', delay: 800 }
    ];

    for (const step of steps) {
        const spinner = ora({
            text: chalk.cyan(step.text),
            spinner: 'dots12'
        }).start();

        await new Promise(resolve => setTimeout(resolve, step.delay));
        spinner.succeed(chalk.green(step.text.replace('...', ' ✓')));
    }

    console.log('\n');
    startServer();
})();

// Paso 1: Iniciar el servidor Node.js
function startServer() {
    serverProcess = spawn('node', ['src/server.js'], {
        stdio: 'pipe',
        shell: true
    });

    serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('corriendo')) {
            startNgrok();
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(chalk.red('❌ Error del servidor:'), data.toString());
    });
}

// Paso 2: Iniciar ngrok
function startNgrok() {
    ngrokProcess = spawn('ngrok', ['http', '3000', '--log=stdout'], {
        stdio: 'pipe',
        shell: true
    });

    let ngrokStarted = false;

    ngrokProcess.stdout.on('data', (data) => {
        const output = data.toString();

        if (output.includes('started tunnel') || output.includes('url=')) {
            if (!ngrokStarted) {
                ngrokStarted = true;
                setTimeout(() => getNgrokUrl(), 2000);
            }
        }
    });

    ngrokProcess.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('command not found') || output.includes('no se reconoce')) {
            console.log('\n');
            box(
                '❌  ERROR: ngrok no está instalado\n\n' +
                '📥  Descarga ngrok:\n' +
                '    https://ngrok.com/download\n\n' +
                '📋  Luego copia ngrok.exe a esta carpeta',
                chalk.red
            );
            cleanup();
        }
    });
}

// Paso 3: Obtener la URL de ngrok
async function getNgrokUrl() {
    try {
        const response = await axios.get('http://127.0.0.1:4040/api/tunnels');
        const tunnels = response.data.tunnels;

        if (tunnels && tunnels.length > 0) {
            const httpsTunnel = tunnels.find(t => t.public_url.startsWith('https'));
            ngrokUrl = httpsTunnel ? httpsTunnel.public_url : tunnels[0].public_url;
            displaySuccess();
        } else {
            setTimeout(() => getNgrokUrl(), 1000);
        }
    } catch (error) {
        setTimeout(() => getNgrokUrl(), 1000);
    }
}

// Mostrar pantalla de éxito
function displaySuccess() {
    console.clear();

    // Logo con gradiente
    figlet('IMPOSTOR', { font: 'ANSI Shadow' }, (err, data) => {
        if (!err) {
            console.log(fireGradient(data));
        }

        console.log(oceanGradient('              🎭  SERVIDOR PÚBLICO ACTIVO  🎭\n'));

        // Marco superior
        console.log(neonCyan('╔' + '═'.repeat(68) + '╗'));
        console.log(neonCyan('║') + ' '.repeat(68) + neonCyan('║'));

        // Título QR
        const qrTitle = '          📱  ESCANEA EL CÓDIGO QR CON TU CELULAR  📱';
        console.log(neonCyan('║') + chalk.yellow.bold(qrTitle) + ' '.repeat(68 - qrTitle.length) + neonCyan('║'));

        console.log(neonCyan('║') + ' '.repeat(68) + neonCyan('║'));
        console.log(neonCyan('╠' + '═'.repeat(68) + '╣'));

        // Generar QR con marco
        qrcode.generate(ngrokUrl, { small: true }, (qrcode) => {
            const qrLines = qrcode.split('\n');
            qrLines.forEach(line => {
                const paddingLeft = Math.floor((68 - line.length) / 2);
                const paddingRight = 68 - line.length - paddingLeft;
                console.log(
                    neonCyan('║') +
                    ' '.repeat(paddingLeft) +
                    chalk.white(line) +
                    ' '.repeat(paddingRight) +
                    neonCyan('║')
                );
            });
        });

        console.log(neonCyan('║') + ' '.repeat(68) + neonCyan('║'));
        console.log(neonCyan('╠' + '═'.repeat(68) + '╣'));

        // URL
        const urlText = `🔗  ${ngrokUrl}`;
        const urlPadding = Math.floor((68 - urlText.length) / 2);
        console.log(
            neonCyan('║') +
            ' '.repeat(urlPadding) +
            gradient.cristal(urlText) +
            ' '.repeat(68 - urlText.length - urlPadding) +
            neonCyan('║')
        );

        console.log(neonCyan('║') + ' '.repeat(68) + neonCyan('║'));
        console.log(neonCyan('╚' + '═'.repeat(68) + '╝'));

        console.log('\n');

        // Sección de monitoreo de jugadores (gráfica)
        displayPlayerMonitor();
        monitorConnections();
    });
}

// Mostrar monitor gráfico de jugadores
function displayPlayerMonitor() {
    console.log('\n' + neonCyan('  ╔' + '═'.repeat(66) + '╗'));
    console.log(neonCyan('  ║') + chalk.white.bold('                    👥  JUGADORES CONECTADOS                      ') + neonCyan('║'));
    console.log(neonCyan('  ╠' + '═'.repeat(66) + '╣'));

    // Barra de progreso visual inicial
    const emptyBar = '░'.repeat(20);
    console.log(neonCyan('  ║') + '  ' + chalk.gray('Progreso: [' + emptyBar + '] 0/3') + ' '.repeat(27) + neonCyan('║'));
    console.log(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║'));

    // Línea de jugadores (íconos)
    const playerIcons = '  ' + chalk.gray('⭕ ⭕ ⭕ ');
    const paddingNeeded = 66 - playerIcons.length + 2;
    console.log(neonCyan('  ║') + playerIcons + ' '.repeat(paddingNeeded) + neonCyan('║'));
    console.log(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║'));

    console.log(neonCyan('  ║') + '  ' + chalk.gray('⏳  Esperando jugadores...') + ' '.repeat(38) + neonCyan('║'));
    console.log(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║'));
    console.log(neonCyan('  ╚' + '═'.repeat(66) + '╝'));
    console.log('');
    console.log(chalk.gray('  💻  Panel ngrok: ') + chalk.blue('http://127.0.0.1:4040'));
    console.log(chalk.gray('  ⚠️   Presiona ') + chalk.yellow('Ctrl+C') + chalk.gray(' para detener el servidor\n'));
}

// Función para actualizar la cajita en el mismo lugar
function updatePlayerDisplay(count) {
    // Calcular barra de progreso
    const totalSlots = 20;
    const filledSlots = Math.floor((count / 3) * totalSlots);
    const emptySlots = totalSlots - filledSlots;

    let progressBar = '';
    let progressColor;

    if (count === 0) {
        progressBar = chalk.gray('░'.repeat(totalSlots));
        progressColor = chalk.gray;
    } else if (count < 3) {
        progressBar = chalk.yellow('█'.repeat(filledSlots)) + chalk.gray('░'.repeat(emptySlots));
        progressColor = chalk.yellow;
    } else {
        progressBar = chalk.green('█'.repeat(totalSlots));
        progressColor = chalk.green;
    }

    // Construir línea de progreso
    const progressLine = neonCyan('  ║') + '  ' + progressColor('Progreso: [' + progressBar + '] ' + count + '/3') + ' '.repeat(Math.max(0, 25 - count.toString().length)) + neonCyan('║');

    // Dibujar jugadores como íconos
    let playerIcons = '  ';
    for (let i = 0; i < count; i++) {
        playerIcons += chalk.cyan('👤 ');
    }
    for (let i = count; i < 3; i++) {
        playerIcons += chalk.gray('⭕ ');
    }
    const playerLine = neonCyan('  ║') + playerIcons + ' '.repeat(Math.max(0, 64 - playerIcons.length)) + neonCyan('║');

    // Estado del juego
    let statusText;
    if (count === 0) {
        statusText = '  ' + chalk.gray('⏳  Esperando jugadores...');
    } else if (count < 3) {
        statusText = '  ' + chalk.yellow(`🎮 ${count} conectado${count > 1 ? 's' : ''} • Faltan ${3 - count} para empezar`);
    } else {
        statusText = '  ' + chalk.green(`✅ ${count} jugadores • ¡Listo para jugar!`);
    }
    const statusLine = neonCyan('  ║') + statusText + ' '.repeat(Math.max(0, 64 - statusText.length)) + neonCyan('║');

    // Mover cursor 9 líneas arriba y redibujar solo las líneas dinámicas
    readline.moveCursor(process.stdout, 0, -9);
    readline.clearScreenDown(process.stdout);

    // Redibujar las 3 líneas dinámicas + las 6 líneas fijas
    process.stdout.write(progressLine + '\n');
    process.stdout.write(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║') + '\n');
    process.stdout.write(playerLine + '\n');
    process.stdout.write(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║') + '\n');
    process.stdout.write(statusLine + '\n');
    process.stdout.write(neonCyan('  ║') + ' '.repeat(66) + neonCyan('║') + '\n');
    process.stdout.write(neonCyan('  ╚' + '═'.repeat(66) + '╝') + '\n');
    process.stdout.write('\n');
    process.stdout.write(chalk.gray('  💻  Panel ngrok: ') + chalk.blue('http://127.0.0.1:4040') + '\n');
    process.stdout.write(chalk.gray('  ⚠️   Presiona ') + chalk.yellow('Ctrl+C') + chalk.gray(' para detener el servidor\n\n'));

    // Mensaje especial cuando llega a 3
    if (count === 3) {
        console.log(fireGradient('  🎉  ¡SUFICIENTES JUGADORES PARA COMENZAR!  🎉\n'));
    }
}

// Monitorear conexiones mejorado
function monitorConnections() {
    // Conectar como cliente para escuchar actualizaciones
    setTimeout(() => {
        socket = io('http://localhost:3000');

        socket.on('connect', () => {
            // Identificarse como conexión de monitoreo
            socket.emit('setMonitor');
        });

        socket.on('updatePlayerCount', (data) => {
            const newCount = data.totalPlayers;

            // Solo actualizar si el conteo cambió
            if (newCount !== playerCount) {
                playerCount = newCount;

                // Actualizar la visualización completa
                updatePlayerDisplay(playerCount);
            }
        });

        socket.on('disconnect', () => {
            console.log(chalk.red('\n  🔌  Monitoreo desconectado'));
        });
    }, 2000);
}

// Animación de carga inicial
function loadingAnimation(text, duration) {
    return new Promise((resolve) => {
        const spinner = ora({
            text: chalk.cyan(text),
            spinner: {
                interval: 80,
                frames: ['◐', '◓', '◑', '◒']
            }
        }).start();

        setTimeout(() => {
            spinner.succeed(chalk.green(text + ' ✓'));
            resolve();
        }, duration);
    });
}
