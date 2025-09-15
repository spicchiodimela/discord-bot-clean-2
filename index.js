require('dotenv').config(); 
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone'); // importante per fuso orario

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
const hostRoleID = '1365390307440722082';
const modRoleID = '1366925681782558781';
const bumpChannelID = '1371148843785126078'; // <- sostituisci con ID reale del canale per il bump

// ===========================================
// Quando il bot è pronto
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  startDeadlineCheck(); // Avvia controllo deadline

  // ===========================================
  // Esecuzione automatica /bump ogni 2 ore
  setInterval(autoBump, 2 * 60 * 60 * 1000); // ogni 2 ore
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

    const deadlineDate = moment.tz(deadlineInput, "YYYY-MM-DD HH:mm", "America/New_York");

    if (!deadlineDate.isValid()) {
      await interaction.reply("❌ Invalid date format. Use YYYY-MM-DD HH:MM (EST timezone).");
      return;
    }

    rounds.push({ roundName, deadline: deadlineDate.toDate().toISOString() });
    fs.writeFileSync(roundsFile, JSON.stringify(rounds, null, 2));

    await interaction.reply(`✅ Deadline for "${roundName}" set to ${deadlineDate.format("MMMM Do YYYY, h:mm A z")} (EST)`);
  }

  // /randomtheme (Host & Mod only)
  if (interaction.commandName === 'randomtheme') {
    const memberRoles = interaction.member.roles.cache;
    if (!memberRoles.has(hostRoleID) && !memberRoles.has(modRoleID)) {
      await interaction.reply({ content: "❌ You don't have permission to use this command!", ephemeral: true });
      return;
    }

    const themesFile = './themes.json';
    let themes = [];
    if (fs.existsSync(themesFile)) {
      themes = JSON.parse(fs.readFileSync(themesFile, 'utf-8'));
    } else {
      themes = ["Glitch in the Matrix", "Nostalgialbums", "Mall Goth Revival", "Cyber Doll", "Sweet 16 Excess", "Zillennial Dreamcore", "Burned CD Love Letters", "Hannah Montana Core", "Bubble Pop Electric", "Frutiger subgenres", "Mean Girl Mayhem", "Bratz Baddie", "Myspace Mayhem", "Boyband Blizzard", "Lisa Frank fantasy", "Nibbles and Nostalgia", "Award Show Duos", "90s Supermodel off-duty", "VHS Glitch Glam", "Fresh Prince Realness", "Video Game Vixens", "Y2k Nightlife"];
    }

    if (themes.length === 0) {
      await interaction.reply("⚠️ All themes have already been used!");
      return;
    }

    const index = Math.floor(Math.random() * themes.length);
    const chosenTheme = themes.splice(index, 1)[0];
    fs.writeFileSync(themesFile, JSON.stringify(themes, null, 2));

    await interaction.reply(`🎉 Random theme selected: **${chosenTheme}**`);
  }

  // /rules
  if (interaction.commandName === 'rules') {
    const rulesEmbed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle('📜 Server Rules')
      .setDescription('Here are the main rules to follow on our server:')
      .addFields(
        { name: '1️⃣ Rule', value: 'Please do not ask or beg to join the comp. There is an application channel for a reason!' },
        { name: '2️⃣ Rule', value: 'Please no leaving once you join. Dedication is expected throughout the contest.' },
        { name: '3️⃣ Rule', value: 'Do not spoil or leak if you got in the cast during reveal period.' },
        { name: '4️⃣ Rule', value: 'No asking opinions on fits before submission. Creativity is key!' },
        { name: '5️⃣ Rule', value: 'Be civil. Resolve disagreements calmly, or take them to DMs.' },
        { name: '6️⃣ Rule', value: 'Do not copy outfits from Pinterest or other creators, including your own previous entries.' },
        { name: '7️⃣ Rule', value: 'Do not ask others to edit your fits. Send raw images if you cannot edit.' },
        { name: '8️⃣ Rule', value: 'No resubmissions unless requested by the hosts.' },
        { name: '9️⃣ Rule', value: 'Respect deadlines to ensure smooth flow of the contest.' }
      )
      .setFooter({ text: 'Have fun and enjoy the community! 🎉' })
      .setTimestamp();

    await interaction.reply({ embeds: [rulesEmbed] });
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

      if (diff <= 24*60*60*1000 && diff > 23.5*60*60*1000) {
        const guild = client.guilds.cache.get(guildID);
        if (!guild) continue;

        const channel = guild.channels.cache.get(submissionsChannelID);
        if (!channel) continue;

        const roleMembers = guild.roles.cache.get(ruoloPartecipantiID).members;
        const messages = await channel.messages.fetch({ limit: 9 });

        const membersWithoutSubmission = roleMembers.filter(member => {
          return !messages.some(msg => msg.author.id === member.id);
        });

        let msg = `<@&${ruoloPartecipantiID}> ⚠️ Only 24 hours left for **${round.roundName}**!`;
        if (membersWithoutSubmission.size > 0) {
          const mentions = membersWithoutSubmission.map(m => `<@${m.id}>`).join(' ');
          msg += `\nThese members haven't submitted yet: ${mentions}`;
        }

        channel.send(msg);
      }
    }
  }, checkInterval);
}

// ===========================================
// Funzione per inviare /bump automaticamente
async function autoBump() {
  try {
    const channel = await client.channels.fetch(bumpChannelID);
    if (!channel) return console.log("❌ Canale bump non trovato!");

    // Trova il bot di Disboard
    const disboardBot = channel.guild.members.cache.find(
      m => m.user.username.toLowerCase().includes("disboard")
    );
    if (!disboardBot) return console.log("❌ Bot di Disboard non trovato!");

    await channel.send(`/bump <@${disboardBot.id}>`);
    console.log("✅ Comand /bump sent!");
  } catch (err) {
    console.error("❌ Error sending /bump:", err);
  }
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
