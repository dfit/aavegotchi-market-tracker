const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get all available commands'),
  async execute(interaction) {
    return interaction.reply(`
    Here the list of available commands : 
**/register-gotchi-tracker** : Set a gotchi tracker for yourself
**/delete-gotchi-tracker** : Delete gotchi tracker set for yourself
    `);
  },
};
