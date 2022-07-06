const baazatRequester = require('./baazarRequester');
const dbManager = require('./dbManager');
const discordBotManager = require('./discord/discordBotManager');

module.exports = {
  async routineCheck() {
    await this.refreshBaazaarListed()
  },
  async refreshBaazaarListed() {
    const listedGotchis = await baazatRequester.requestListedGotchis()
    const listedParcels = await baazatRequester.requestListedParcels()
    const newListedGotchis = this.checkNewListings(listedGotchis);
    const newListedParcels = this.checkNewListings(listedParcels);
    this.notifyDiscordUsers(newListedGotchis, "gotchis")
    this.notifyDiscordUsers(newListedParcels, "parcels")

    dbManager.db.push("/lastCheck", new Date().getTime())
  },
  checkNewListings(listedElements) {
    let lastCheck;
    try {
      lastCheck = dbManager.db.getData("/lastCheck")
    } catch (e) {
      lastCheck = new Date().getTime()
    }
    return listedElements.filter(element => element.timeCreated * 1000 > lastCheck )
  },
  notifyDiscordUsers(newListedElements, type) {
    if(newListedElements.length > 0) {
      discordBotManager.sendNewListings(newListedElements, type)
    } else {
      console.log(`No new listed ${type} found`)
    }
  }
}
