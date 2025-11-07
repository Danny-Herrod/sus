// Lista de avatares predeterminados usando emojis
const defaultAvatars = [
    // Animales
    { id: 'cat', emoji: '🐱', name: 'Gato' },
    { id: 'dog', emoji: '🐶', name: 'Perro' },
    { id: 'fox', emoji: '🦊', name: 'Zorro' },
    { id: 'lion', emoji: '🦁', name: 'León' },
    { id: 'tiger', emoji: '🐯', name: 'Tigre' },
    { id: 'bear', emoji: '🐻', name: 'Oso' },
    { id: 'panda', emoji: '🐼', name: 'Panda' },
    { id: 'koala', emoji: '🐨', name: 'Koala' },
    { id: 'monkey', emoji: '🐵', name: 'Mono' },
    { id: 'rabbit', emoji: '🐰', name: 'Conejo' },
    { id: 'wolf', emoji: '🐺', name: 'Lobo' },
    { id: 'pig', emoji: '🐷', name: 'Cerdo' },
    { id: 'frog', emoji: '🐸', name: 'Rana' },
    { id: 'chicken', emoji: '🐔', name: 'Pollo' },
    { id: 'penguin', emoji: '🐧', name: 'Pingüino' },
    { id: 'bird', emoji: '🐦', name: 'Pájaro' },
    { id: 'owl', emoji: '🦉', name: 'Búho' },
    { id: 'eagle', emoji: '🦅', name: 'Águila' },

    // Caras y expresiones
    { id: 'smile', emoji: '😊', name: 'Sonrisa' },
    { id: 'cool', emoji: '😎', name: 'Cool' },
    { id: 'star', emoji: '🤩', name: 'Estrella' },
    { id: 'think', emoji: '🤔', name: 'Pensativo' },
    { id: 'wink', emoji: '😉', name: 'Guiño' },
    { id: 'laugh', emoji: '😂', name: 'Risa' },
    { id: 'heart', emoji: '😍', name: 'Amor' },
    { id: 'party', emoji: '🥳', name: 'Fiesta' },
    { id: 'nerd', emoji: '🤓', name: 'Nerd' },
    { id: 'ninja', emoji: '🥷', name: 'Ninja' },

    // Objetos y símbolos
    { id: 'fire', emoji: '🔥', name: 'Fuego' },
    { id: 'rocket', emoji: '🚀', name: 'Cohete' },
    { id: 'crown', emoji: '👑', name: 'Corona' },
    { id: 'gem', emoji: '💎', name: 'Gema' },
    { id: 'trophy', emoji: '🏆', name: 'Trofeo' },
    { id: 'guitar', emoji: '🎸', name: 'Guitarra' },
    { id: 'gamepad', emoji: '🎮', name: 'Control' },
    { id: 'pizza', emoji: '🍕', name: 'Pizza' },
    { id: 'coffee', emoji: '☕', name: 'Café' },
    { id: 'donut', emoji: '🍩', name: 'Dona' },

    // Fantasía
    { id: 'alien', emoji: '👽', name: 'Alien' },
    { id: 'robot', emoji: '🤖', name: 'Robot' },
    { id: 'ghost', emoji: '👻', name: 'Fantasma' },
    { id: 'unicorn', emoji: '🦄', name: 'Unicornio' },
    { id: 'dragon', emoji: '🐉', name: 'Dragón' },
    { id: 'wizard', emoji: '🧙', name: 'Mago' },
    { id: 'vampire', emoji: '🧛', name: 'Vampiro' },
    { id: 'zombie', emoji: '🧟', name: 'Zombie' }
];

// Función para obtener un avatar aleatorio
function getRandomAvatar() {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[randomIndex];
}

// Función para obtener avatar por ID
function getAvatarById(id) {
    return defaultAvatars.find(avatar => avatar.id === id) || getRandomAvatar();
}
