const { SlashCommandBuilder } = require('@discordjs/builders');
const userTrackersManager = require('../../userTrackersManager');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('delete-parcel-tracker')
  .setDescription('Delete your parcel tracker'),
  async execute(interaction) {
    userTrackersManager.deleteTracker(interaction.user.id, "parcels")
    return interaction.reply(`Parcel tracker deleted for ${interaction.user.username}`);
  },
};
