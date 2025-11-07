const killPort = require('./kill-port');
const { fork } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor IMPOSTOR...\n');

// Primero limpiar el puerto
killPort();

// Esperar un momento y luego iniciar el servidor
setTimeout(() => {
    console.log('🎮 Iniciando servidor...\n');

    const serverPath = path.join(__dirname, '../src/server.js');
    const server = fork(serverPath, [], {
        stdio: 'inherit'
    });

    server.on('error', (error) => {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    });

    server.on('exit', (code) => {
        if (code !== 0) {
            console.log(`\n❌ Servidor terminó con código ${code}`);
        }
        process.exit(code);
    });

    // Manejar Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n👋 Cerrando servidor...');
        server.kill('SIGINT');
        process.exit(0);
    });

}, 1000);
