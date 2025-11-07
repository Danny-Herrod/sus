# 🎮 IMPOSTOR - Guía de Uso

## 📋 Inicio Rápido

### Opción 1: Inicio Simple (Local)
Para jugar solo en tu red local (WiFi):

```bash
npm start
```

- ✅ Limpia automáticamente el puerto 3000
- ✅ Inicia solo el servidor Node.js
- ✅ Funciona en red local
- ❌ NO tiene acceso público (sin ngrok)

### Opción 2: Inicio Público con ngrok (Recomendado) ⭐
Para jugar desde cualquier lugar con acceso público:

```bash
npm run start-public
```

- ✅ Limpia automáticamente el puerto 3000
- ✅ Inicia servidor Node.js
- ✅ **Inicia ngrok automáticamente**
- ✅ **Genera URL pública automáticamente**
- ✅ **Muestra QR en terminal con colores**
- ✅ **Monitor de jugadores en tiempo real**

### Opción 3: Solo limpiar el puerto
Si solo quieres liberar el puerto 3000:

```bash
npm run kill-port
```

## 🌐 Acceder al Juego

### Local (mismo dispositivo)
- **Jugar**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

### Opción A: Con ngrok automático (MÁS FÁCIL) ⭐

1. Instala ngrok: https://ngrok.com/download

2. Copia `ngrok.exe` al PATH de tu sistema o a la carpeta del proyecto

3. Inicia con un solo comando:
   ```bash
   npm run start-public
   ```

4. **¡Listo!** El terminal mostrará:
   - Logo animado
   - QR code grande en la terminal
   - URL pública de ngrok
   - Monitor de jugadores en tiempo real

5. Los jugadores escanean el QR y juegan

### Opción B: Con ngrok manual (más control)

1. **Terminal 1** - Inicia el servidor:
   ```bash
   npm start
   ```

2. **Terminal 2** - Inicia ngrok:
   ```bash
   ngrok http 3000
   ```

3. **Navegador** - Abre el dashboard con la URL de ngrok:
   ```
   https://TU-URL-NGROK.ngrok.io/dashboard
   ```

4. **El código QR en el dashboard** se generará automáticamente con la URL de ngrok

## 📱 Dashboard

El dashboard muestra:
- ✅ Código QR con la URL correcta (ngrok o local)
- ✅ Estadísticas en tiempo real
- ✅ Jugadores conectados
- ✅ Historial de partidas
- ✅ **NO aparece como jugador** (es solo un monitor)

## ❌ Solución de Problemas

### Error: "address already in use 0.0.0.0:3000"

**Solución 1**: Usa `npm start` (limpia automáticamente)

**Solución 2**: Limpia manualmente:
```bash
npm run kill-port
```

**Solución 3**: En Windows, mata el proceso manualmente:
```bash
netstat -ano | findstr :3000
taskkill /PID [numero_del_pid] /F
```

### El QR muestra localhost en lugar de ngrok

1. Asegúrate de acceder al dashboard **a través de la URL de ngrok**, no localhost
2. Ejemplo: `https://abc123.ngrok.io/dashboard` (no `http://localhost:3000/dashboard`)
3. El servidor detecta automáticamente ngrok desde los headers

## 🎯 Comparación de Métodos

### Método 1: `npm run start-public` (TODO AUTOMÁTICO) ⭐⭐⭐
```bash
npm run start-public
```
✅ **Un solo comando lo hace todo**
- Limpia puerto automáticamente
- Inicia servidor
- Inicia ngrok automáticamente
- Muestra QR en terminal (grande y bonito)
- Monitor de jugadores en tiempo real
- Sin necesidad de navegador

❌ **Requiere**:
- ngrok instalado y en PATH

### Método 2: `npm start` + Dashboard Web
```bash
npm start
# En otra terminal: ngrok http 3000
# Abrir navegador: https://tu-url.ngrok.io/dashboard
```
✅ **Ventajas**:
- Dashboard web moderno
- Historial de partidas
- Estadísticas detalladas
- Más control visual

❌ **Desventajas**:
- Requiere 2-3 pasos
- Necesitas abrir navegador

## 🔧 Comandos Disponibles

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `npm run start-public` | **Todo automático con ngrok** ⭐ | Producción/fiestas |
| `npm start` | Limpia puerto e inicia servidor | Desarrollo/local |
| `npm run kill-port` | Solo limpia el puerto 3000 | Debug |
| `npm run start-simple` | Inicia sin limpiar puerto | Testing |

## 📝 Notas

- El dashboard **no cuenta como jugador**
- Mínimo 3 jugadores para iniciar partida
- Las estadísticas se actualizan cada 3 segundos
- El historial muestra las últimas 10 partidas
