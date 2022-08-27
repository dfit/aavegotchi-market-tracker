const dbManager = require('./dbManager');
module.exports = {
  availableTrackers: ["gotchis", "parcels"],
  createGotchiTracker(userId, params) {
    this.deleteTracker(userId, "gotchis")
    dbManager.db.push("/gotchis[]", {...params, trackerType: "gotchis", id: userId})
  },
  createParcelsTracker(userId, params) {
    this.deleteTracker(userId, "parcels")
    dbManager.db.push("/parcels[]", {...params, trackerType: "parcels", id: userId})
  },
  deleteTracker(userId, trackerType) {
    const trackerTypeMessage = `/${trackerType}`
    try {
      dbManager.db.getData(trackerTypeMessage);
      if(dbManager.db.getIndex(trackerTypeMessage, userId) === -1) return
    } catch(error) {
      console.log(`${trackerTypeMessage} doesn't exists yet`)
      return
    }
    dbManager.db.delete(`/${trackerType}[${dbManager.db.getIndex(trackerTypeMessage, userId)}]`)
  },
  getUserTracker(userId, trackerType) {
    const trackerTypeMessage = `/${trackerType}`
    return dbManager.db.getData(`/${trackerType}[${dbManager.db.getIndex(trackerTypeMessage, userId)}]`)
  },
  getAllUserTrackers(userId) {
    return this.availableTrackers.map(tracker => this.getUserTracker(userId, tracker))
  },
  getAllTrackersByType(trackerType) {
    return dbManager.db.getData(`/${trackerType}`)
  }
}
