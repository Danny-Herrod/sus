# 🌐 Configuración para Acceso Externo (Fuera de tu WiFi)

Hay varias formas de permitir que jugadores fuera de tu red WiFi se conecten:

## Opción 1: ngrok (Recomendado - Más Fácil) ⭐

ngrok crea un túnel seguro que expone tu servidor local a Internet.

### Instalación:

1. **Descarga ngrok**
   - Ve a: https://ngrok.com/download
   - Descarga la versión para Windows
   - Descomprime el archivo

2. **Crea una cuenta gratuita** (opcional pero recomendado)
   - Regístrate en: https://dashboard.ngrok.com/signup
   - Copia tu authtoken
   - En la terminal: `ngrok authtoken TU_TOKEN_AQUI`

3. **Inicia tu servidor IMPOSTOR**
   ```bash
   npm start
   ```

4. **En otra terminal, inicia ngrok**
   ```bash
   ngrok http 3000
   ```

5. **Comparte la URL**
   - ngrok te dará una URL como: `https://abc123.ngrok.io`
   - Comparte esa URL con tus amigos
   - Ellos la abren en su navegador y ¡listo!

### Ventajas:
- ✅ Gratis
- ✅ No requiere configuración de router
- ✅ HTTPS automático (seguro)
- ✅ Funciona desde cualquier lugar del mundo
- ✅ Muy fácil de usar

### Desventajas:
- ⚠️ La URL cambia cada vez que reinicias ngrok (versión gratis)
- ⚠️ Límite de conexiones simultáneas en versión gratuita

---

## Opción 2: Playit.gg (Alternativa Gratuita)

Similar a ngrok pero especializado en gaming.

### Instalación:

1. **Descarga Playit**
   - Ve a: https://playit.gg/download
   - Descarga para Windows

2. **Ejecuta Playit**
   - Abre la aplicación
   - Selecciona "Add Tunnel"
   - Puerto: 3000
   - Tipo: TCP

3. **Comparte la URL**
   - Playit te dará una dirección
   - Compártela con tus amigos

---

## Opción 3: Port Forwarding (Avanzado)

Configurar port forwarding en tu router.

### Pasos:

1. **Obtén tu IP local**
   - Windows: `ipconfig` → busca "Dirección IPv4"
   - Ejemplo: 192.168.1.100

2. **Accede a tu router**
   - Abre navegador: http://192.168.1.1 (o 192.168.0.1)
   - Usuario/contraseña (usualmente está en el router)

3. **Configura Port Forwarding**
   - Busca sección "Port Forwarding" o "NAT"
   - Agrega nueva regla:
     - Puerto externo: 3000
     - Puerto interno: 3000
     - IP local: Tu IP local (192.168.1.100)
     - Protocolo: TCP

4. **Obtén tu IP pública**
   - Ve a: https://www.whatismyip.com/
   - Copia tu IP pública

5. **Comparte tu IP**
   - Tus amigos acceden a: `http://TU_IP_PUBLICA:3000`

### Ventajas:
- ✅ URL permanente (tu IP pública)
- ✅ Sin intermediarios

### Desventajas:
- ⚠️ Requiere acceso al router
- ⚠️ Configuración técnica
- ⚠️ Expone tu IP pública
- ⚠️ Riesgos de seguridad si no sabes lo que haces

---

## Opción 4: Hosting en la Nube (Permanente)

Deploya tu aplicación en un servicio de hosting.

### Servicios Recomendados (Gratis):

#### A. **Render** (Más fácil)
1. Ve a: https://render.com
2. Crea cuenta gratuita
3. "New" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configuración:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy

#### B. **Railway**
1. Ve a: https://railway.app
2. Crea cuenta con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu proyecto
5. Railway detectará automáticamente Node.js

#### C. **Fly.io**
1. Ve a: https://fly.io
2. Instala CLI: https://fly.io/docs/hands-on/install-flyctl/
3. En tu proyecto:
   ```bash
   fly launch
   fly deploy
   ```

### Ventajas:
- ✅ Siempre disponible (24/7)
- ✅ URL permanente
- ✅ No requiere tener tu PC encendida
- ✅ Escalable

### Desventajas:
- ⚠️ Requiere subir código a GitHub
- ⚠️ Configuración inicial más compleja
- ⚠️ Límites en plan gratuito

---

## 🎯 Recomendación

**Para jugar ocasionalmente con amigos:**
→ Usa **ngrok** (Opción 1)

**Para tener siempre disponible:**
→ Usa **Render o Railway** (Opción 4)

---

## 📝 Script Rápido para ngrok

He creado un archivo que simplifica el proceso:

```bash
# En Windows, crea un archivo: start-ngrok.bat
npm start & ngrok http 3000
```

Ejecuta este archivo y tendrás tanto el servidor como ngrok corriendo.

---

## ⚠️ Consideraciones de Seguridad

- No compartas URLs públicas en redes sociales
- Usa contraseñas si planeas hosting permanente
- Cierra ngrok/servidor cuando no lo uses
- Nunca compartas tu authtoken de ngrok
