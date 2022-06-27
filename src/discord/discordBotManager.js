const { Client, Collection, Intents, BaseFetchOptions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const token = process.env.DISCORD_TOKEN
const guildId = process.env.ID_GUILD
const clientId = process.env.ID_CLIENT
const idBazaar = process.env.ID_BAAZAAR
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const web3 = require('web3');
const userTrackersManager = require('../userTrackersManager');
const dbManager = require('../userTrackersManager');

function formatNewGotchiListedMessage(listedGotchi) {
  return `New listing! ${listedGotchi.gotchi.name} (${listedGotchi.gotchi.id}) - ${listedGotchi.gotchi.baseRarityScore} BRS - ${listedGotchi.gotchi.kinship} Kinship,  listed the ${new Date(
    listedGotchi.timeCreated * 1000).toLocaleString()} for ${web3.utils.fromWei(
    listedGotchi.priceInWei)} ghst:\nhttps://app.aavegotchi.com/baazaar/erc721/${listedGotchi.id}`;
}

function sendGotchisListedByChunks(gotchis, channel) {
  const chunkSize = 10;
  for (let i = 0; i < gotchis.length; i += chunkSize) {
    channel.send(gotchis.slice(i, i + chunkSize).map(tmp => tmp.message).join("\n"))
  }
}

module.exports = {
  client: client,
  async setupDiscordBot() {
    this.registerBotCommands();
    this.registerBotCommandsHandler();
    await client.login(token);
  },
  registerBotCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
  },
  registerBotCommandsHandler() {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      client.commands.set(command.data.name, command);
    }

    client.once('ready', () => {
      console.log('Ready!');
    });

    client.on('interactionCreate', async interaction => {
      if (interaction.isModalSubmit()) {
        this.handleModals(interaction)
      }
      if (!interaction.isCommand()) return;
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    });
  },
  sendNewListings(newListedGotchis) {
    const newListedGotchisEnhanced = newListedGotchis.map(listedGotchi => ({...listedGotchi, message: formatNewGotchiListedMessage(listedGotchi)}))
    client.channels.fetch(idBazaar).then(channel => {
      sendGotchisListedByChunks(newListedGotchisEnhanced, channel);
    });
    const trackers = userTrackersManager.getUsersTracker()
    trackers.forEach(tracker => {
      const matchedWithTracker = newListedGotchisEnhanced.filter(newListedGotchiEnhanced => Number(web3.utils.fromWei(newListedGotchiEnhanced.priceInWei)) < Number(tracker.ghst) && Number(newListedGotchiEnhanced.gotchi.baseRarityScore) > Number(tracker.minBrs) && Number(newListedGotchiEnhanced.gotchi.kinship) > Number(tracker.kinship))
      if(matchedWithTracker.length > 0) this.notifyUser(tracker.userId, matchedWithTracker)
    })
  },
  async notifyUser(userId, gotchis) {
    try {
      const userChannel = await client.users.fetch(userId, {cache: false, force: true}).catch(error => console.log(error));
      if(userChannel == null) dbManager.deleteTracker(userId)
      sendGotchisListedByChunks(gotchis, userChannel)
    } catch (e) {
      console.log(e)
    }
  },
  handleModals(interaction) {
    if(interaction.customId === "register-gotchi-tracker") {
      const ghst = interaction.fields.getTextInputValue('ghstCost');
      const minBrs = interaction.fields.getTextInputValue('brs');
      const kinship = interaction.fields.getTextInputValue('kinship');
      const userId = interaction.user.id;
      console.log({ userId, ghst, minBrs, kinship});
      userTrackersManager.createTracker(userId, {userId, ghst, minBrs, kinship})
      return interaction.reply(`Tracker for gotchi with minimum of ${minBrs} base rarity score, a minimum of ${kinship} kinship and with a maximum cost of ${ghst} ghst created for ${interaction.user.username}`);
    }
  }
}
