# IMPOSTOR - Instrucciones de Uso

## Estado del Proyecto
El servidor y el dashboard están funcionando correctamente. Todos los archivos necesarios están en su lugar.

## Cómo Iniciar el Servidor

### Opción 1: Inicio Normal
```bash
npm start
```

### Opción 2: Inicio con QR (Recomendado)
```bash
npm run start-public
```

## Acceder al Juego

### Para Jugadores
1. Abre tu navegador en: `http://localhost:3000`
2. Ingresa tu nombre (mínimo 3 caracteres, único)
3. Espera a que otros jugadores se conecten
4. Cuando todos estén listos, el juego comenzará automáticamente

### Para Ver el Dashboard
1. Abre tu navegador en: `http://localhost:3000/dashboard`
2. Verás:
   - Código QR para que otros se conecten fácilmente
   - Estadísticas en tiempo real
   - Jugadores conectados
   - Historial de partidas

## Conectar desde Otros Dispositivos

### En la Misma Red WiFi
1. Averigua tu IP local:
   - **Windows**: Abre `cmd` y escribe `ipconfig`
   - Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

2. Desde otro dispositivo en la misma red:
   - Abre el navegador
   - Ve a: `http://[TU-IP]:3000`
   - Ejemplo: `http://192.168.1.100:3000`

3. Para el dashboard:
   - Ve a: `http://[TU-IP]:3000/dashboard`

## Características del Juego

### Lobby
- Mínimo 3 jugadores para comenzar
- Todos deben marcar "LISTO"
- Se puede ingresar una palabra personalizada (opcional)

### Durante el Juego
1. Cada jugador toca "Revelar" para ver su rol
2. Un jugador es el impostor (no ve la palabra)
3. Los demás jugadores ven la palabra secreta
4. Discutan para descubrir quién es el impostor
5. Revelen la palabra al final

### Después del Juego
- Todos deben marcar "LISTO PARA NUEVO JUEGO"
- El juego se reinicia automáticamente

## Solución de Problemas

### El servidor no inicia
```bash
# Verifica que las dependencias estén instaladas
npm install

# Intenta iniciar nuevamente
npm start
```

### No puedo conectarme desde otro dispositivo
1. Verifica que estés en la misma red WiFi
2. Verifica que no haya firewall bloqueando el puerto 3000
3. En Windows, puede que necesites permitir la conexión en el Firewall

### El dashboard no muestra datos
1. Actualiza la página (F5)
2. Verifica que el servidor esté corriendo
3. Abre la consola del navegador (F12) para ver errores

### Los jugadores no pueden unirse
1. Verifica que el nombre tenga al menos 3 caracteres
2. Verifica que el nombre no esté duplicado
3. Verifica la conexión a internet/red local

## Puertos Utilizados
- **Puerto 3000**: Servidor principal (configurable en `src/server.js`)

## Archivos Importantes
- `src/server.js`: Servidor principal
- `src/words.js`: Lista de palabras del juego
- `public/index.html`: Cliente del juego
- `public/dashboard.html`: Panel de control
- `public/script.js`: Lógica del cliente

## Logs y Depuración
El servidor muestra información útil en la consola:
- Conexiones de jugadores
- Estado del juego
- Errores y advertencias

Mantén la consola abierta para monitorear el estado del servidor.
