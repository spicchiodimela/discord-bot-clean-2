require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const http = require('http');

// Array di frasi per /lyrics
const lyrics = [
  "Its gettin late, Im making my way over to my favorite place",
  "Shes a maneater, make you buy cars, make you cut cards, make you fall real hard in love",
  "Baby, cant you see Im calling? A guy like you should wear a warning",
  "I know what you are, what you are baby, Womanizer, woman-womanizer, you re a womanizer",
  "Gitchie, gitchie, ya-ya, da-da Gitchie, gitchie, ya-ya, here",
  "S-O-S, please, someone help me Its not healthy for me to feel this",
  "If I could escape and recreate a place thats my own world",
  "Cant read mine, cant read my, No, he cant read my poker face",
  "I dont like your girlfriend, No way, no way, I think you need a new one",
  "Ive been everywhere, man, looking for someone",
  "California girls, we re unforgettable",
  "Lets go to the beach-each, lets go get away, They say, what they gonna say?",
  "Put on your brake lights, youre in the city of wonder",
  "So, I put my hands up, They re playing my song, the butterflies fly away",
  "Just dance, spin that record, babe",
  "Everybody on the floor, let me show you how we do"
];

// Array di catchphrase delle Winx
const winx = [
  "Showtime, girls!",
  "What did you do, comb your hair with an egg beater?",
  "Come on you idiots! Do what Musa says!",
  "Yooo hooo, anyone here? This place is emptier than a mall on Monday",
  "Not so fast, Romeo!",
  "Chimera, for once in your life sht up!",
  "Listen Stella, if you fall in the dark and twist your ankle, I am NOT gonna carry you",
  "This is ridiculous, Brandon better buy me a dress to thank me for this",
  "Im a PRINCESS, so I dont clean"
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

// Comando slash
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'lyrics') {
    const frase = lyrics[Math.floor(Math.random() * lyrics.length)];
    await interaction.reply(frase);
  }

  if (interaction.commandName === 'winx') {
    const frase = winxPhrases[Math.floor(Math.random() * winxPhrases.length)];
    await interaction.reply(frase);
  }
});

// Connessione con il token
client.login(process.env.BOT_TOKEN);

// ===========================================
// Server HTTP finto per Render
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot online\n');
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

