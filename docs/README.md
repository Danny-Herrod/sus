# 🎭 IMPOSTOR - Juego Multijugador

Juego presencial multijugador donde todos los dispositivos se conectan al servidor y un jugador es elegido aleatoriamente como el impostor.

## 📋 Requisitos

- Node.js instalado en tu PC (versión 14 o superior)

## 🌐 Modos de Juego

### Modo Local (Misma WiFi)
- Todos los dispositivos deben estar en la misma red WiFi
- Ideal para jugar en casa o reuniones presenciales

### Modo Público (Cualquier ubicación) ⭐ NUEVO
- Jugadores pueden conectarse desde cualquier lugar del mundo
- Requiere configuración adicional (ver sección "Acceso Externo")

## 🚀 Instalación

1. Abre la terminal/cmd en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará las dependencias necesarias (Express y Socket.IO).

## 🎮 Cómo Jugar

### 1. Iniciar el servidor (en tu PC)

Abre la terminal/cmd en la carpeta del proyecto y ejecuta:

```bash
npm start
```

Verás un mensaje como:
```
🎮 Servidor IMPOSTOR corriendo en:
   http://localhost:3000

📱 Para conectar desde otros dispositivos:
   1. Asegúrate de estar en la misma red WiFi
   2. Desde tu móvil, visita: http://[TU-IP-LOCAL]:3000
```

### 2. Obtener tu IP local

#### Windows:
1. Abre CMD (símbolo del sistema)
2. Escribe: `ipconfig`
3. Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

#### Mac/Linux:
1. Abre Terminal
2. Escribe: `ifconfig`
3. Busca la dirección IP (ejemplo: 192.168.1.100)

### 3. Conectar dispositivos

En cada teléfono/tablet:
1. Abre el navegador (Chrome, Safari, etc.)
2. Escribe en la barra de direcciones: `http://TU-IP:3000`
   - Ejemplo: `http://192.168.1.100:3000`
3. Espera a que todos los jugadores se conecten

### 4. Iniciar el juego

1. Cuando haya al menos 3 jugadores conectados, el botón "INICIAR JUEGO" se habilitará
2. Cualquier jugador puede presionar el botón para comenzar
3. Opcionalmente pueden ingresar una palabra personalizada
4. El servidor asignará automáticamente la palabra y el impostor

### 5. Revelar roles

1. Cada jugador toca la carta en su dispositivo para revelar su rol
2. Si eres el impostor, verás: "¡TÚ ERES EL IMPOSTOR!"
3. Si no lo eres, verás la palabra secreta
4. Cuando todos hayan revelado, comienza la discusión para encontrar al impostor

### 6. Nueva partida

- Presiona "REINICIAR JUEGO" para volver al lobby
- Los jugadores permanecen conectados y pueden iniciar otra ronda

## 🎯 Reglas del Juego

1. **Todos conocen la palabra EXCEPTO el impostor**
2. **El impostor debe fingir que conoce la palabra**
3. **Los jugadores hablan por turnos dando pistas sobre la palabra**
4. **El impostor debe adivinar cuál es la palabra o no ser descubierto**
5. **Al final, todos votan quién creen que es el impostor**

## 🌍 Acceso Externo (Jugar desde cualquier lugar)

¿Quieres que amigos fuera de tu WiFi se unan? Tienes varias opciones:

### Opción 1: ngrok (Más Fácil) ⭐ RECOMENDADO

1. **Descarga ngrok**: https://ngrok.com/download
2. **Inicia tu servidor**:
   ```bash
   npm start
   ```
3. **En otra terminal, ejecuta**:
   ```bash
   ngrok http 3000
   ```
4. **Comparte la URL**: ngrok te dará una URL como `https://abc123.ngrok.io`
5. **Tus amigos la abren** y ¡listo!

**Ventajas**: Gratis, fácil, seguro (HTTPS), funciona desde cualquier lugar.

📖 **Guía detallada**: Ver archivo [ngrok-setup.md](ngrok-setup.md)

### Opción 2: Hosting en la Nube (24/7)

Deploya tu juego en servicios gratuitos:

- **Render**: https://render.com (Recomendado)
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io

📖 **Instrucciones completas**: Ver archivo [ngrok-setup.md](ngrok-setup.md)

### Opción 3: Port Forwarding (Avanzado)

Configura tu router para exponer el puerto 3000.

⚠️ **Solo si sabes lo que haces** - Ver [ngrok-setup.md](ngrok-setup.md)

---

## 🔧 Configuración Firewall (Solo Modo Local)

Si los dispositivos no se pueden conectar en la misma WiFi:

### Windows:
1. Busca "Firewall de Windows Defender"
2. Clic en "Permitir una aplicación..."
3. Permite Node.js en redes privadas

### Mac:
1. Ve a Preferencias del Sistema > Seguridad > Firewall
2. Desbloquea y agrega Node.js

## 📱 Características

- ✅ Multiplayer en tiempo real con WebSockets
- ✅ Detección automática de jugadores conectados
- ✅ Diseño responsive optimizado para móviles
- ✅ Efectos de sonido
- ✅ Asignación aleatoria del impostor
- ✅ Banco de más de 300 palabras
- ✅ Opción de palabra personalizada
- ✅ Sincronización automática entre dispositivos

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Comunicación**: WebSockets en tiempo real

## ⚠️ Solución de Problemas

**Error: No se puede conectar desde el móvil**
- Verifica que todos estén en la misma red WiFi
- Revisa que el firewall no bloquee el puerto 3000
- Asegúrate de usar la IP correcta

**Error: npm no reconocido**
- Instala Node.js desde https://nodejs.org

**Error: El servidor no inicia**
- Verifica que el puerto 3000 no esté en uso
- Cierra otras aplicaciones que puedan usar ese puerto

## 📞 Soporte

Si tienes problemas, verifica:
1. Node.js está instalado: `node --version`
2. Las dependencias están instaladas: `npm install`
3. El firewall permite conexiones en el puerto 3000
4. Todos los dispositivos están en la misma red WiFi

---

¡Disfruta jugando a IMPOSTOR! 🎭🎮
