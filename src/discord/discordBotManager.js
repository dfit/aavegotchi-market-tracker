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
const typeSizeConverter = {"0" : "humble", "1" : "reasonable", "2": "spacious"}


function formatNewGotchiListedMessage(listedGotchi) {
  return `New listing! ${listedGotchi.gotchi.name} (${listedGotchi.gotchi.id}) - ${listedGotchi.gotchi.baseRarityScore} BRS - ${listedGotchi.gotchi.kinship} Kinship,  listed the ${new Date(
    listedGotchi.timeCreated * 1000).toLocaleString()} for ${web3.utils.fromWei(
    listedGotchi.priceInWei)} ghst:\nhttps://app.aavegotchi.com/baazaar/erc721/${listedGotchi.id}`;
}

function formatNewParcelListedMessage(listedParcel) {
  return `New parcel listing! ${listedParcel.parcel.id} (${listedParcel.parcel.parcelId}) - district ${listedParcel.parcel.district} - ${typeSizeConverter[listedParcel.parcel.size]},  listed the ${new Date(
    listedParcel.timeCreated * 1000).toLocaleString()} for ${web3.utils.fromWei(
    listedParcel.priceInWei)} ghst:\nhttps://app.aavegotchi.com/baazaar/erc721/${listedParcel.id}`;
}
function isMatchingTrackerForParcelSize(tracker, listing) {
  if(tracker.type === "all") return true
  if(tracker.type === "humble" && listing.parcel.size === "0") return true
  if(tracker.type === "reasonable" && listing.parcel.size === "1") return true
  return tracker.type === "spacious" && listing.parcel.size === "2";
}

function sendElementsListedByChunks(elements, channel) {
  const chunkSize = 10;
  for (let i = 0; i < elements.length; i += chunkSize) {
    channel.send(elements.slice(i, i + chunkSize).map(tmp => tmp.message).join("\n"))
  }
}

function registerParcelTrackerModalHandler(interaction) {
  const ghst = interaction.fields.getTextInputValue('ghstCost');
  const type = interaction.fields.getTextInputValue('type').toLowerCase();
  const district = interaction.fields.getTextInputValue('district');
  const userId = interaction.user.id;
  console.log({ userId, ghst, type, district });
  const isInputsValid = !isNaN(Number(ghst)) && ["humble", "reasonable", "spacious", "all"].includes(type) && !isNaN(
    Number(district))
  if (isInputsValid) {
    userTrackersManager.createParcelsTracker(userId, { userId, ghst, type, district })
    const parcelTypeMessage = type === "all" ? "of any type" : `of ${type} size`
    const districtMessage = district === "0" ? "in any district" : `in district ${district}`
    return interaction.reply(
      `Tracker for parcel ${parcelTypeMessage} ${districtMessage} with a maximum cost of ${ghst} ghst created for ${interaction.user.username}`);
  } else {
    return interaction.reply(
      "Tracker for parcels can't be created: ghst cost is not a number or type is not (humble, reasonable, spacious or all) or district is not a number");
  }
}

function registerGotchisTrackerModalHandler(interaction) {
  const ghst = interaction.fields.getTextInputValue('ghstCost');
  const minBrs = interaction.fields.getTextInputValue('brs');
  const kinship = interaction.fields.getTextInputValue('kinship');
  const userId = interaction.user.id;
  console.log({ userId, ghst, minBrs, kinship });
  const isInputsValid = !isNaN(Number(ghst)) && !isNaN(Number(minBrs)) && !isNaN(Number(kinship))
  if (isInputsValid) {
    userTrackersManager.createGotchiTracker(userId, { userId, ghst, minBrs, kinship })
    return interaction.reply(
      `Tracker for gotchi with minimum of ${minBrs} base rarity score, a minimum of ${kinship} kinship and with a maximum cost of ${ghst} ghst created for ${interaction.user.username}`);
  } else {
    return interaction.reply(
      "Tracker for gotchi can't be created: ghst cost, min brs or kinship inputs are not valid, please use only numbers");
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
  sendNewListings(newListedElements, type) {
    const newListedElementsEnhanced = newListedElements.map(listedElement => ({...listedElement, message: type === "gotchis" ? formatNewGotchiListedMessage(listedElement) : formatNewParcelListedMessage(listedElement)}))
    client.channels.fetch(idBazaar).then(channel => {
      sendElementsListedByChunks(newListedElementsEnhanced, channel);
    });
    const trackers = userTrackersManager.getAllTrackersByType(type)
    trackers.forEach(tracker => {
      const matchedWithTracker = newListedElementsEnhanced.filter(newListedElementEnhanced => {
        if(tracker.trackerType === "gotchis") return Number(web3.utils.fromWei(newListedElementEnhanced.priceInWei)) < Number(tracker.ghst) && Number(newListedElementEnhanced.gotchi.baseRarityScore) > Number(tracker.minBrs) && Number(newListedElementEnhanced.gotchi.kinship) > Number(tracker.kinship)
        if(tracker.trackerType === "parcels") return Number(web3.utils.fromWei(newListedElementEnhanced.priceInWei)) < Number(tracker.ghst) && (tracker.district !== "0" ? Number(newListedElementEnhanced.parcel.district) === Number(tracker.district) : true) && isMatchingTrackerForParcelSize(tracker, newListedElementEnhanced)
      })
      if(matchedWithTracker.length > 0) this.notifyUser(tracker.userId, matchedWithTracker)
    })
  },
  async notifyUser(userId, elementsListed) {
    try {
      const userChannel = await client.users.fetch(userId, {cache: false, force: true}).catch(error => console.log(error));
      if(userChannel == null) {
        dbManager.deleteTracker(userId, "gotchis")
        dbManager.deleteTracker(userId, "parcels")
      }
      sendElementsListedByChunks(elementsListed, userChannel)
    } catch (e) {
      console.log(e)
    }
  },
  handleModals(interaction) {
    if(interaction.customId === "register-gotchi-tracker") {
      return registerGotchisTrackerModalHandler(interaction);
    } else if(interaction.customId === "register-parcel-tracker") {
      return registerParcelTrackerModalHandler(interaction);
    }
  }
}
