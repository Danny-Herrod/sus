# 🚀 INICIO RÁPIDO - IMPOSTOR

## 📦 Instalación Inicial (Solo la primera vez)

1. **Instala las dependencias**:
   ```bash
   npm install
   ```

2. **Descarga ngrok** (si aún no lo tienes):
   - Ve a: https://ngrok.com/download
   - Descarga para Windows
   - Descomprime `ngrok.exe`
   - Copia `ngrok.exe` a esta carpeta del proyecto
   - O agrégalo a tu PATH de Windows

---

## 🎮 Jugar en la Misma WiFi (Local)

**Opción 1: Doble clic**
- Abre `start-public.bat`

**Opción 2: Terminal**
```bash
npm start
```

Los jugadores abren en su navegador: `http://TU-IP-LOCAL:3000`

---

## 🌍 Jugar desde Cualquier Lugar (Público) ⭐

### Método Automático con QR (RECOMENDADO)

**Opción 1: Doble clic**
1. Abre `start-public.bat`
2. Espera 10 segundos
3. ¡Aparecerá un código QR en la terminal!
4. Los jugadores lo escanean con su celular
5. ¡A jugar!

**Opción 2: Terminal**
```bash
npm run start-public
```

### ¿Qué hace el script automático?

1. ✅ Inicia el servidor Node.js
2. ✅ Inicia ngrok automáticamente
3. ✅ Genera un código QR
4. ✅ Muestra la URL para compartir
5. ✅ Monitorea conexiones activas

---

## 📱 Ejemplo de lo que verás:

```
╔═══════════════════════════════════════════╗
║                                           ║
║     ██╗███╗   ███╗██████╗  ██████╗        ║
║     ██║████╗ ████║██╔══██╗██╔═══██╗       ║
║     ██║██╔████╔██║██████╔╝██║   ██║       ║
║     ██║██║╚██╔╝██║██╔═══╝ ██║   ██║       ║
║     ██║██║ ╚═╝ ██║██║     ╚██████╔╝       ║
║     ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝        ║
║                                           ║
║       🎭 EL JUEGO DEL ENGAÑO 🎭           ║
║                                           ║
╚═══════════════════════════════════════════╝

✅ ¡SERVIDOR PÚBLICO ACTIVO!

══════════════════════════════════════════════════

📱 ESCANEA ESTE CÓDIGO QR CON TU CELULAR:

  [Código QR aquí]

🔗 O comparte esta URL:

   https://abc123.ngrok.io

══════════════════════════════════════════════════

📋 Instrucciones:
   1. Los jugadores escanean el QR o abren la URL
   2. Esperan a que todos se conecten
   3. Cualquiera presiona "INICIAR JUEGO"
   4. ¡A jugar!

💡 Panel de control de ngrok:
   http://127.0.0.1:4040

⚠️  Presiona Ctrl+C para detener el servidor
```

---

## ⚡ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor local (solo WiFi) |
| `npm run start-public` | Servidor público con QR |
| `start-public.bat` | Mismo que arriba (Windows) |

---

## ❓ Problemas Comunes

### Error: "ngrok no se reconoce"
**Solución**:
1. Descarga ngrok de https://ngrok.com/download
2. Copia `ngrok.exe` en esta carpeta
3. O agrégalo al PATH de Windows

### Error: "Puerto 3000 en uso"
**Solución**:
1. Cierra otros servidores
2. O reinicia tu PC

### El QR no aparece
**Solución**:
1. Espera 10-15 segundos
2. Verifica que ngrok esté instalado
3. Revisa que el servidor haya iniciado correctamente

---

## 🎯 Flujo del Juego

1. **Inicio**: Ejecuta `start-public.bat`
2. **Conexión**: Jugadores escanean QR
3. **Lobby**: Ven cuántos están conectados
4. **Inicio**: Alguien presiona "INICIAR JUEGO"
5. **Revelar**: Cada uno toca su carta
6. **Discutir**: Hablan y dan pistas
7. **Revelar Palabra**: Presionan el botón cuando terminen
8. **Nuevo Juego**: "NUEVO JUEGO" para otra ronda

---

## 💡 Tips

- 🔋 Mantén tu PC conectada a la corriente
- 📶 Asegúrate de tener buena conexión a Internet
- 🔄 El QR cambia cada vez que reinicias (versión gratis de ngrok)
- 👥 Máximo jugadores recomendado: 10-12
- 📱 Funciona en cualquier navegador moderno

---

¡Disfruta el juego! 🎭
