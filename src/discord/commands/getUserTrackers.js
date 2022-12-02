const { SlashCommandBuilder } = require('@discordjs/builders');
const userTrackersManager = require('../../userTrackersManager');

function formatTrackers(trackers) {
  return trackers.map(tracker => {
    if(tracker.trackerType === "gotchis") {
      return `-Gotchi tracker with ${tracker.minBrs} minimum brs, ${tracker.kinship} minimum kinship and ${tracker.ghst} max ghst price`
    } else if(tracker.trackerType === "parcels") {
      const parcelTypeMessage = tracker.type === "all" ? "of any type" : `of ${tracker.type} size`
      const districtMessage = tracker.district === "0" ? "in any district" : `in district ${tracker.district}`
      return `-Parcel tracker ${parcelTypeMessage} ${districtMessage} and ${tracker.ghst} max ghst price`
    }
  })
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName('get-user-trackers')
  .setDescription('Get all trackers registered'),
  async execute(interaction) {
    const userTrackers = userTrackersManager.getAllUserTrackers(interaction.user.id)
    const formatedTrackers = formatTrackers(userTrackers)
    if(userTrackers.length === 0) return interaction.reply("No trackers found");
    return interaction.reply(`Trackers for ${interaction.user.username} :\n${formatedTrackers.join("\n")}`);
  },
};
