# IMPOSTOR - El Juego del Engaño

Juego multijugador presencial donde los jugadores deben descubrir quién es el impostor.

## Estructura del Proyecto

```
impostor/
├── public/              # Archivos estáticos del cliente (HTML, CSS, JS)
│   ├── index.html       # Página principal del juego
│   ├── test-debug.html  # Página de pruebas
│   ├── styles.css       # Estilos del juego
│   └── script.js        # Lógica del cliente
│
├── src/                 # Código del servidor
│   ├── server.js        # Servidor principal con Socket.IO
│   └── start-with-qr.js # Script para iniciar servidor con QR
│
├── docs/                # Documentación del proyecto
│   ├── README.md        # Documentación completa
│   ├── INICIO-RAPIDO.md # Guía de inicio rápido
│   └── ngrok-setup.md   # Configuración de ngrok
│
├── scripts/             # Scripts auxiliares
│   └── start-public.bat # Script de Windows para inicio rápido
│
├── config/              # Archivos de configuración
│   ├── railway.json     # Configuración para Railway
│   └── render.yaml      # Configuración para Render
│
├── node_modules/        # Dependencias de Node.js
├── package.json         # Configuración del proyecto
├── package-lock.json    # Versiones exactas de dependencias
└── .gitignore          # Archivos ignorados por Git
```

## Inicio Rápido

### Instalación

```bash
npm install
```

### Iniciar el servidor

**Opción 1: Servidor local simple**
```bash
npm start
```

**Opción 2: Servidor con QR para acceso desde móviles**
```bash
npm run start-public
```

O en Windows, ejecuta: `scripts/start-public.bat`

## Documentación

Para más información, consulta la carpeta [docs/](docs/):
- [Documentación completa](docs/README.md)
- [Guía de inicio rápido](docs/INICIO-RAPIDO.md)
- [Configuración de ngrok](docs/ngrok-setup.md)

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **WebSockets**: Socket.IO
- **Utilidades**: QRCode Terminal, Chalk, Figlet

## Licencia

MIT
