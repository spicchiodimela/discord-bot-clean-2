require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const http = require('http');

// ===========================================
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

// ===========================================
// Array di catchphrase delle Winx
const winxPhrases = [
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

// ===========================================
// Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===========================================
// File rounds.json
let rounds = [];
const roundsFile = './rounds.json';
if (fs.existsSync(roundsFile)) {
  rounds = JSON.parse(fs.readFileSync(roundsFile, 'utf-8'));
}

// ===========================================
// Config server (sostituisci con i tuoi ID)
const guildID = '1365361537732182088';
const submissionsChannelID = '1405971298580041780';
const ruoloPartecipantiID = '1405592912670232606';

// ===========================================
// Quando il bot è pronto
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  startDeadlineCheck(); // Avvia controllo deadline
});

// ===========================================
// Comando !ping
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }
});

// ===========================================
// Comandi slash
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /lyrics
  if (interaction.commandName === 'lyrics') {
    const frase = lyrics[Math.floor(Math.random() * lyrics.length)];
    await interaction.reply(frase);
  }

  // /winx
  if (interaction.commandName === 'winx') {
    const frase = winxPhrases[Math.floor(Math.random() * winxPhrases.length)];
    await interaction.reply(frase);
  }

  // /deadline
  if (interaction.commandName === 'deadline') {
    const roundName = interaction.options.getString('round');
    const deadlineInput = interaction.options.getString('deadline');
    const deadlineDate = new Date(deadlineInput);

    if (isNaN(deadlineDate)) {
      await interaction.reply('❌ Formato data non valido.\nUsa il formato **YYYY-MM-DDTHH:MM** (esempio: 2025-09-16T12:00)');
      return;
    }

    // Salva in memoria
    rounds.push({ roundName, deadline: deadlineDate.toISOString() });
    // Salva su file JSON
    fs.writeFileSync(roundsFile, JSON.stringify(rounds, null, 2));

    await interaction.reply(`✅ Deadline per "${roundName}" salvata per ${deadlineDate.toUTCString()}`);
  }
});

// ===========================================
// Funzione controllo deadline e reminder
function startDeadlineCheck() {
  const checkInterval = 60 * 60 * 1000; // ogni ora

  setInterval(async () => {
    const now = new Date();

    for (const round of rounds) {
      const diff = new Date(round.deadline) - now;

      // Reminder 24 ore prima
      if (diff <= 24*60*60*1000 && diff > 23.5*60*60*1000) {
        const guild = client.guilds.cache.get(guildID);
        if (!guild) continue;

        const channel = guild.channels.cache.get(submissionsChannelID);
        if (!channel) continue;

        const roleMembers = guild.roles.cache.get(ruoloPartecipantiID).members;

        // Recupera ultimi 100 messaggi dal canale
        const messages = await channel.messages.fetch({ limit: 100 });

        // Filtra chi non ha inviato
        const membersWithoutSubmission = roleMembers.filter(member => {
          return !messages.some(msg => msg.author.id === member.id);
        });

        // Prepara il messaggio
        let msg = `<@&${1405592912670232606}> ⚠️ 24 hours left! ${round.roundName}!`;
        if (membersWithoutSubmission.size > 0) {
          const mentions = membersWithoutSubmission.map(m => `<@${m.id}>`).join(' ');
          msg += `\nHavent submitted yet: ${mentions}`;
        }

        channel.send(msg);
      }
    }
  }, checkInterval);
}

// ===========================================
// Connessione con token
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

