const baazatRequester = require('./baazarRequester');
const dbManager = require('./dbManager');
const discordBotManager = require('./discord/discordBotManager');

module.exports = {
  async routineCheck() {
    await this.refreshGotchisListed()
  },
  async refreshGotchisListed() {
    const listedGotchis = await baazatRequester.requestListedGotchis()
    const newListedGotchis = this.checkNewListings(listedGotchis);
    this.notifyDiscordUsers(newListedGotchis)

    dbManager.db.push("/lastCheck", new Date().getTime())
  },
  checkNewListings(listedGotchis) {
    let lastCheck;
    try {
      lastCheck = dbManager.db.getData("/lastCheck")
    } catch (e) {
      lastCheck = new Date().getTime()
    }
    return listedGotchis.filter(listedGotchi => listedGotchi.timeCreated * 1000 > lastCheck )
  },
  notifyDiscordUsers(newListedGotchis) {
    if(newListedGotchis.length > 0) {
      discordBotManager.sendNewListings(newListedGotchis)
    } else {
      console.log("No new listed gotchi found")
    }
  }
}
