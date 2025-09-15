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

  // Nuovo comando /deadline
  new SlashCommandBuilder()
    .setName('deadline')
    .setDescription('Set a deadline')
    .addStringOption(option =>
      option.setName('round')
        .setDescription('Round name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('deadline')
        .setDescription('Deadline date (formato: YYYY-MM-DD HH:MM, UTC)')
        .setRequired(true))
].map(cmd => cmd.toJSON());

// Setup REST per registrare i comandi
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
