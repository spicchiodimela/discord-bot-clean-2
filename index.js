require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

// Array di frasi per /lyrics
const lyrics = [
  "Its gettin late, Im making my way over to my favorite place",
  "Life is a highway, I wanna ride it all night long",
  "Dont stop believin, hold on to that feelin"
];

// Creazione del client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Quando il bot è online
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Comando !ping
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }
});

// Comando slash /lyrics
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'lyrics') {
    const frase = lyrics[Math.floor(Math.random() * lyrics.length)];
    await interaction.reply(frase);
  }
});

// Connessione con il token
client.login(process.env.BOT_TOKEN);

// ===========================================
// Server HTTP finto per Render
const http = require('http');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot online\n');
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
