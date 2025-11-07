const { execSync } = require('child_process');
const os = require('os');

const PORT = 3000;

function killPort() {
    const platform = os.platform();

    try {
        if (platform === 'win32') {
            // Windows
            console.log(`🔍 Buscando procesos en el puerto ${PORT}...`);

            try {
                // Encontrar el PID usando el puerto
                const findCommand = `netstat -ano | findstr :${PORT}`;
                const output = execSync(findCommand, { encoding: 'utf8' });

                // Extraer PIDs únicos
                const pids = new Set();
                const lines = output.split('\n');

                lines.forEach(line => {
                    const match = line.trim().match(/\s+(\d+)\s*$/);
                    if (match && match[1] !== '0') {
                        pids.add(match[1]);
                    }
                });

                if (pids.size > 0) {
                    console.log(`💀 Matando procesos: ${Array.from(pids).join(', ')}`);
                    pids.forEach(pid => {
                        try {
                            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                        } catch (e) {
                            // Ignorar errores si el proceso ya no existe
                        }
                    });
                    console.log(`✅ Puerto ${PORT} liberado`);
                } else {
                    console.log(`✅ Puerto ${PORT} ya está libre`);
                }
            } catch (e) {
                console.log(`✅ Puerto ${PORT} está libre`);
            }
        } else {
            // Linux/Mac
            console.log(`🔍 Buscando procesos en el puerto ${PORT}...`);
            try {
                const pid = execSync(`lsof -ti:${PORT}`, { encoding: 'utf8' }).trim();
                if (pid) {
                    console.log(`💀 Matando proceso ${pid}...`);
                    execSync(`kill -9 ${pid}`);
                    console.log(`✅ Puerto ${PORT} liberado`);
                }
            } catch (e) {
                console.log(`✅ Puerto ${PORT} está libre`);
            }
        }
    } catch (error) {
        console.log(`✅ Puerto ${PORT} está libre`);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    killPort();
}

module.exports = killPort;
