require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

// Legge round e temi già salvati se esistono
let rounds = [];
if (fs.existsSync('./rounds.json')) {
  rounds = JSON.parse(fs.readFileSync('./rounds.json', 'utf-8'));
}

let themes = [];
if (fs.existsSync('./themes.json')) {
  themes = JSON.parse(fs.readFileSync('./themes.json', 'utf-8'));
}

// Comandi del bot
const commands = [
  new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Random y2k songs lyrics'),

  new SlashCommandBuilder()
    .setName('winx')
    .setDescription('Random quote from Winx'),

  new SlashCommandBuilder()
    .setName('deadline')
    .setDescription('Set a deadline')
    .addStringOption(option =>
      option.setName('round')
        .setDescription("Round name")
        .setRequired(true))
    .addStringOption(option =>
      option.setName('deadline')
        .setDescription('Deadline date (YYYY-MM-DD HH:MM, UTC)')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('randomtheme')
    .setDescription('Select a random theme for mini showdown'),

  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Displays the server rules')
].map(cmd => cmd.toJSON()); // <-- tutto incluso nell'array

// Setup REST per registrare comandi
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('🔄 Registrazione comandi...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Comandi registrati!');
  } catch (error) {
    console.error(error);
  }
})();

