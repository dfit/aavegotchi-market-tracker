require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
const naiveAlgo = require('./src/naiveAlgo');
const discordClient = require('./src/discord/discordBotManager');
const dbManager = require('./src/dbManager');

const TIME_BETWEEN_ITERATION = 400000;

async function setup() {
  await discordClient.setupDiscordBot()
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

