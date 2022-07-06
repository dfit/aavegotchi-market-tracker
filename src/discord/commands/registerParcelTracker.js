const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('register-parcel-tracker')
  .setDescription('Set a parcel tracker for yourself'),
  async execute(interaction) {
    const modal = new Modal()
    .setCustomId('register-parcel-tracker')
    .setTitle('Set a parcel tracker for yourself');
    const ghstCost = new TextInputComponent()
    .setCustomId('ghstCost')
    .setLabel("How much GHST is your limit ?")
    .setStyle('SHORT');
    //CHANGE TO SELECT WHEN AVAILABLE
    const type = new TextInputComponent()
    .setCustomId('type')
    .setLabel("humble, reasonable, spacious, all")
    .setStyle('SHORT');
    const district = new TextInputComponent()
    .setCustomId('district')
    .setLabel("Which district ? (0 for all)")
    .setStyle('SHORT');

    const firstActionRow = new MessageActionRow().addComponents(ghstCost);
    const secondActionRow = new MessageActionRow().addComponents(type);
    const thirdActionRow = new MessageActionRow().addComponents(district);
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    await interaction.showModal(modal);
  },
};
