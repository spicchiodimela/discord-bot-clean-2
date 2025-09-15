require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

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
    .setDescription('Set a deadline for a round (EST timezone)')
    .addStringOption(option =>
      option.setName('round')
        .setDescription('Name of the round')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('deadline')
        .setDescription('Deadline date (YYYY-MM-DD HH:MM, EST)')
        .setRequired(true))
].map(cmd => cmd.toJSON());

// Setup REST per registrare comandi
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('🔄 Registering commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
