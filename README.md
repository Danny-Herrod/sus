# IMPOSTOR - Juego Multijugador de Deducción Social

[![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

## Descripción

**IMPOSTOR** es una aplicación web multijugador en tiempo real diseñada para facilitar partidas presenciales de deducción social. El sistema permite a los jugadores conectarse mediante dispositivos móviles o computadoras para participar en una experiencia de juego interactiva donde deben identificar al impostor entre ellos.

La aplicación está construida con arquitectura cliente-servidor utilizando tecnologías web modernas, con comunicación bidireccional en tiempo real mediante WebSockets.

## Características Técnicas

- **Comunicación en Tiempo Real**: Implementación de WebSockets mediante Socket.IO para sincronización instantánea entre clientes
- **Arquitectura Cliente-Servidor**: Separación clara entre lógica de presentación y lógica de negocio
- **Acceso Multiplataforma**: Compatible con navegadores modernos en dispositivos móviles y escritorio
- **Conexión Simplificada**: Generación automática de códigos QR para facilitar el acceso desde dispositivos móviles
- **Sin Autenticación**: Sistema sin registro que prioriza la rapidez de acceso
- **Escalabilidad**: Preparado para deployment en servicios cloud (Railway, Render)

## Requisitos del Sistema

### Prerequisitos

- **Node.js**: v14.0.0 o superior
- **npm**: v6.0.0 o superior (incluido con Node.js)
- **Navegador**: Versiones actuales de Chrome, Firefox, Safari o Edge

### Dependencias Principales

```json
{
  "express": "^4.18.2",
  "socket.io": "^4.5.4",
  "cors": "^2.8.5",
  "qrcode-terminal": "^0.12.0",
  "chalk": "^4.1.2",
  "figlet": "^1.6.0"
}
```

## Instalación

### Método 1: Instalación Estándar

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd impostor

# Instalar dependencias
npm install
```

### Método 2: Desde el Código Fuente

```bash
# Descargar y descomprimir el proyecto
# Navegar al directorio del proyecto
cd impostor

# Instalar dependencias
npm install
```

## Configuración

### Variables de Entorno

El proyecto soporta las siguientes variables de entorno (opcionales):

```env
PORT=3000                    # Puerto del servidor (default: 3000)
NODE_ENV=production          # Ambiente de ejecución
```

### Configuración de Red

**Servidor Local (LAN)**
- El servidor se ejecuta por defecto en el puerto 3000
- Accesible desde la red local mediante la IP de la máquina host

**Servidor Público (Internet)**
- Requiere configuración de túnel (ngrok) o deployment en servicio cloud
- Script incluido para facilitar exposición pública

## Uso

### Inicio Rápido

**Opción 1: Servidor Local**

Para jugar en la misma red WiFi:

```bash
npm start
```

El servidor estará disponible en:
- Local: `http://localhost:3000`
- Red: `http://<IP-local>:3000`

**Opción 2: Servidor Público con QR**

Para acceso desde Internet con código QR automático:

```bash
npm run start-public
```

En Windows, alternativamente:
```bash
scripts\start-public.bat
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en modo local |
| `npm run start-public` | Inicia el servidor con túnel público y código QR |
| `npm run kill-port` | Termina procesos en el puerto 3000 |

## Arquitectura del Proyecto

```
impostor/
│
├── public/                      # Recursos del cliente
│   ├── index.html              # Interfaz principal del juego
│   ├── test-debug.html         # Herramienta de depuración
│   ├── styles.css              # Hojas de estilo
│   └── script.js               # Lógica del cliente y manejo de Socket.IO
│
├── src/                        # Código del servidor
│   ├── server.js               # Servidor Express y configuración de Socket.IO
│   └── start-with-qr.js        # Inicializador con generación de QR
│
├── scripts/                    # Scripts auxiliares
│   └── start-public.bat        # Script de inicio rápido para Windows
│
├── config/                     # Archivos de configuración
│   ├── railway.json            # Configuración para Railway
│   └── render.yaml             # Configuración para Render
│
├── package.json                # Manifest del proyecto y dependencias
├── package-lock.json           # Lock file de dependencias
├── .gitignore                  # Archivos excluidos del control de versiones
└── README.md                   # Documentación del proyecto
```

## Stack Tecnológico

### Frontend

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos y diseño responsive
- **JavaScript (ES6+)**: Lógica de la interfaz de usuario
- **Socket.IO Client**: Comunicación en tiempo real con el servidor

### Backend

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **Socket.IO**: Biblioteca para comunicación WebSocket bidireccional
- **CORS**: Middleware para Cross-Origin Resource Sharing

### Utilidades

- **QRCode Terminal**: Generación de códigos QR en consola
- **Chalk**: Colorización de salidas en terminal
- **Figlet**: Generación de texto ASCII art

## Deployment

### Railway

1. Instalar Railway CLI:
```bash
npm install -g @railway/cli
```

2. Iniciar sesión y desplegar:
```bash
railway login
railway init
railway up
```

### Render

1. Conectar el repositorio a Render
2. El archivo `render.yaml` contiene la configuración necesaria
3. Render detectará automáticamente la configuración

### Heroku

```bash
# Instalar Heroku CLI
# Iniciar sesión
heroku login

# Crear aplicación
heroku create nombre-app

# Desplegar
git push heroku main
```

### Deployment Manual

Para cualquier servicio de hosting que soporte Node.js:

1. Configurar la variable de entorno `PORT`
2. Ejecutar `npm install --production`
3. Iniciar con `npm start`

## Mecánica del Juego

### Flujo de Juego

1. **Inicio de Sesión**: Los jugadores escanean el código QR o acceden a la URL proporcionada
2. **Asignación de Roles**: El sistema asigna aleatoriamente el rol de impostor a uno de los participantes
3. **Fase de Discusión**: Los jugadores interactúan físicamente para identificar comportamientos sospechosos
4. **Votación**: Los jugadores votan para eliminar al sospechoso
5. **Victoria**:
   - Tripulación gana al expulsar al impostor
   - Impostor gana al permanecer sin ser detectado

### Roles

- **Tripulante**: Debe identificar y votar contra el impostor
- **Impostor**: Debe evitar ser descubierto mientras simula ser un tripulante

## Contribución

### Guía de Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork del repositorio
2. Crear una rama para la funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. Commit de los cambios: `git commit -m 'Añade nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir un Pull Request

### Estándares de Código

- Utilizar ES6+ para JavaScript
- Mantener consistencia con el estilo existente
- Documentar funciones complejas
- Probar cambios antes de enviar PR

## Roadmap

### Funcionalidades Planificadas

- [ ] Sistema de salas/lobbies múltiples
- [ ] Configuración personalizable de juego
- [ ] Estadísticas y registro de partidas
- [ ] Sistema de roles adicionales (Detective, etc.)
- [ ] Integración de chat de voz
- [ ] Panel de administración
- [ ] API REST para integración externa
- [ ] Versión móvil nativa

## Seguridad

### Consideraciones de Seguridad

- El proyecto está diseñado para uso en entornos de confianza
- No almacena datos personales de usuarios
- No requiere autenticación para simplificar el acceso
- Para uso en producción, considerar implementar:
  - Rate limiting
  - Validación de entrada
  - Cifrado de comunicaciones (HTTPS)

## Solución de Problemas

### Problemas Comunes

**El servidor no inicia**
```bash
# Verificar que el puerto no esté en uso
npm run kill-port
# Reintentar
npm start
```

**Los clientes no se conectan**
- Verificar que estén en la misma red (modo local)
- Revisar configuración del firewall
- Confirmar que el puerto esté accesible

**Error de módulos no encontrados**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo `LICENSE` para más detalles.

## Contacto y Soporte

Para reportar bugs o solicitar funcionalidades, utilice el sistema de Issues del repositorio.

---

**Nota**: Este proyecto es una implementación educativa y no está afiliado con InnerSloth LLC ni con el juego Among Us.

**Desarrollado con Node.js y Socket.IO**
