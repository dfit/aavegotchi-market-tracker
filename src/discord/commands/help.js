const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get all available commands'),
  async execute(interaction) {
    return interaction.reply(`
    Here the list of available commands : 
**/register-gotchi-tracker** : Set a gotchi tracker for yourself
**/register-parcel-tracker** : Set a parcel tracker for yourself
**/delete-gotchi-tracker** : Delete gotchi tracker set for yourself
**/delete-parcel-tracker** : Delete parcel tracker set for yourself
**/get-user-trackers** : Get all trackers registered set for yourself
    `);
  },
};
