<div align="center">

# 🚀 IMPOSTOR - The Deception Game

<img src="https://i.imgur.com/vXyQGIS.gif" alt="Among Us Sus" width="200"/>

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### 🔴 *There is 1 Impostor Among Us* 🔴

**A real-time multiplayer game where trust is optional and betrayal is inevitable**

[🎮 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) • [🎯 Features](#-features)

---

</div>

## 📖 About

**IMPOSTOR** is a multiplayer in-person game inspired by the popular social deduction game. Players must work together to discover who among them is the impostor before it's too late!

<div align="center">
<img src="https://i.imgur.com/K0KPgis.jpeg" alt="Emergency Meeting" width="300"/>

*"Red is sus"* - Every crewmate ever
</div>

## ✨ Features

- 🎭 **Real-time Multiplayer** - Play with friends using Socket.IO
- 📱 **Mobile Friendly** - Scan QR code to join from any device
- 🎨 **Clean UI** - Simple and intuitive interface
- 🔒 **No Registration** - Jump right into the action
- 🌐 **Local & Public** - Play on LAN or expose via ngrok
- ⚡ **Fast Setup** - Get started in under 60 seconds

## 🎯 How to Play

1. **Start the server** and share the QR code or URL
2. **Players join** from their phones or computers
3. **Roles are assigned** secretly (Crewmate or Impostor)
4. **Discuss and vote** to find the impostor!
5. **Win conditions:**
   - 👥 Crewmates: Identify and vote out the impostor
   - 🔪 Impostor: Remain undetected until the end

<div align="center">
<img src="https://i.imgur.com/3cpzfJz.jpeg" alt="Impostor" width="250"/>
</div>

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd impostor

# Install dependencies
npm install
```

### Run the Game

**Option 1: Local Server** (Same WiFi network)
```bash
npm start
```

**Option 2: Public Server** (Internet accessible with QR)
```bash
npm run start-public
```

Or on Windows, double-click: `scripts/start-public.bat`

<div align="center">
<img src="https://i.imgur.com/whtaTVW.png" alt="Not the impostor" width="200"/>

*When you're actually innocent but everyone votes you anyway*
</div>

## 📂 Project Structure

```
impostor/
├── 📁 public/              # Client-side files
│   ├── index.html          # Main game page
│   ├── test-debug.html     # Debug/testing page
│   ├── styles.css          # Game styles
│   └── script.js           # Client logic
│
├── 📁 src/                 # Server-side code
│   ├── server.js           # Main server with Socket.IO
│   └── start-with-qr.js    # Server launcher with QR code
│
├── 📁 scripts/             # Utility scripts
│   └── start-public.bat    # Windows quick-start script
│
├── 📁 config/              # Configuration files
│   ├── railway.json        # Railway deployment config
│   └── render.yaml         # Render deployment config
│
├── 📦 package.json         # Project dependencies
└── 📋 README.md            # You are here!
```

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Real-time | Utilities |
|----------|---------|-----------|-----------|
| HTML5 | Node.js | Socket.IO | QRCode Terminal |
| CSS3 | Express.js | WebSockets | Chalk |
| JavaScript (ES6+) | CORS | - | Figlet |

</div>

## 🎮 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start local server (port 3000) |
| `npm run start-public` | Start with ngrok and QR code |
| `npm run kill-port` | Kill process on port 3000 |

## 🌐 Deployment

### Railway

```bash
# Deploy to Railway
railway up
```

### Render

Push to your repository and connect it to Render. The `render.yaml` configuration is already set up!

### Manual Deployment

Set the following environment variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

<div align="center">
<img src="https://i.imgur.com/NQQsWYQ.jpeg" alt="Ejected" width="250"/>

*That feeling when you get ejected but you were innocent*
</div>

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the project
2. 🔧 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] Add voice chat integration
- [ ] Implement game rooms/lobbies
- [ ] Add custom game settings
- [ ] Create game statistics and leaderboards
- [ ] Add more roles (Detective, Jester, etc.)
- [ ] Mobile app version

## ⚠️ Disclaimer

<div align="center">
<img src="https://i.imgur.com/xzvL93q.jpeg" alt="Sus" width="200"/>

This is a fan-made project and is not affiliated with InnerSloth LLC or Among Us.

**Remember:** Always play fair and have fun! 🎮

---

Made with ❤️ and a lot of sus moments

*"If not me, then who?" - Every impostor ever*

</div>
