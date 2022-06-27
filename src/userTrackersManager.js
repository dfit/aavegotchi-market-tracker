const dbManager = require('./dbManager');

module.exports = {
  createTracker(userId, params) {
    dbManager.db.push("/trackers[]", {...params, id: userId})
  },
  deleteTracker(userId) {
    dbManager.db.delete(`/trackers[${dbManager.db.getIndex("/trackers", userId)}]`)
  },
  getUsersTracker() {
    return dbManager.db.getData(`/trackers`)
  }
}
