const { SlashCommandBuilder } = require('@discordjs/builders');
const userTrackersManager = require('../../userTrackersManager');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('delete-gotchi-tracker')
  .setDescription('Delete gotchi tracker'),
  async execute(interaction) {
    userTrackersManager.deleteTracker(interaction.user.id)
    return interaction.reply(`Gotchi tracker deleted for ${interaction.user.username}`);
  },
};
