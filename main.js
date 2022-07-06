require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
const naiveAlgo = require('./src/naiveAlgo');
const discordClient = require('./src/discord/discordBotManager');
const dbManager = require('./src/dbManager');
const SEARCH_FOR_PAST_LISTING = false; // can be used to seek for past listings since you launched the app

const TIME_BETWEEN_ITERATION = 200000;

async function setup() {
  await discordClient.setupDiscordBot()
  if(!SEARCH_FOR_PAST_LISTING) dbManager.db.push("/lastCheck", new Date().getTime())
}

async function main() {
  try {
    await naiveAlgo.routineCheck()
  } catch (e) {
    console.log(e)
  }
  setTimeout(() => {
    main()
  }, TIME_BETWEEN_ITERATION)
}
setup().then(() => main());

