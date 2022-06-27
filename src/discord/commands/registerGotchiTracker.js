const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('register-gotchi-tracker')
  .setDescription('Set a gotchi tracker for yourself'),
  async execute(interaction) {
    const modal = new Modal()
    .setCustomId('register-gotchi-tracker')
    .setTitle('Set a gotchi tracker for yourself');
    const ghstCost = new TextInputComponent()
    .setCustomId('ghstCost')
    .setLabel("How much GHST is your limit ?")
    .setStyle('SHORT');
    const brs = new TextInputComponent()
    .setCustomId('brs')
    .setLabel("How much BRS should the gotchi have ?")
    .setStyle('SHORT');
    const kinship = new TextInputComponent()
    .setCustomId('kinship')
    .setLabel("How much kinship should the gotchi have ?")
    .setStyle('SHORT');

    const firstActionRow = new MessageActionRow().addComponents(ghstCost);
    const secondActionRow = new MessageActionRow().addComponents(brs);
    const thirdActionRow = new MessageActionRow().addComponents(kinship);
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    await interaction.showModal(modal);
  },
};
