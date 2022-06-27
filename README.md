## Aavegotchi market tracker

It is for me a good exercise to get more familiar with web3 dev environment and mechanics.

Any comment, remark or suggestions would be highly appreciated.

## Main actions

The purpose of the app is to notify a channel the listings of gotchis as a passive thing.

You can also set a tracker with parameters for yourself. This tracker will take some parameters (ghst cost, brs minimum, kinship minimum) and each time a listing posted match your requirement you'll get DM from the discord bot.

For now here the commands listed commands :
* ```/register-gotchi-tracker``` : Set a gotchi tracker for yourself
* ```/delete-gotchi-tracker``` : Delete gotchi tracker set for yourself
* ```/help``` : Get all available commands


## How it works ##


An user can use the command ```/register-gotchi-tracker``` to create a tracker based on his choice, the tracker will be registered on the db.
All gotchis listed to the baazaar are pulled each 5 minutes and set locally on a json database.
During this routine the bot will try to match the new listed gotchis with users that register a tracker. On match, a DM with all matched gotchis will be send to the users.
## Prerequisites

* node
* [Discord bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) set
* (pm2 if wanted)


## IMPORTANT ##
Please don't hesitate to ask if you're not sure about a specific part of the code before starting it.

## Steps to install

### 1. Clone the repo

```bash 
https://github.com/dfit/aavegotchi-market-tracker.git
```

### 2. Install npm package

```bash 
npm install
```

### 3. Env vars

Every needed information (token/id/...) and the way to obtain them is describe in the [discordjs](https://discordjs.guide/#before-you-begin) guide.
```bash 
export PRIVATE_KEY=<enter-your-private-key> 
//private key (until I find something better ...)
export DISCORD_TOKEN=<enter-your-discord-token>
export ID_BAAZAAR=<enter-your-baazaar-channel-id>
export ID_CLIENT=<enter-your-application-id> //go to https://discord.com/developers/applications/me and find "application id" and copy it
export ID_GUILD=<enter-your-discord-server-id> //right click on channel and select "copy id"
```

### 4. How to run the bot
```bash
node main
```

### 5. How to run the bot (alternative)

Alternatively you can use the [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) command to run your bot on background and managing it a little bit better.

You can add the `--no-autorestart` to `pm2` command in order to only execute the bot once.

```bash
pm2 start main.js --no-autorestart
```

### 6. Example

`node main`
```bash
[2022-04-19 19:18:55.394] [LOG]   Public address : 0xa9589438851A7eFBa37bC45ebE2be558c4bA3055
[2022-04-19 19:18:55.415] [LOG]   Initiate naive algo...
[2022-04-19 19:18:56.148] [LOG]   Balance of 0xa9589438851A7eFBa37bC45ebE2be558c4bA3055 : 0 GHST
[2022-04-19 19:18:56.149] [LOG]   Gotchi 99999 will be petted in 29925.851 seconds.
[2022-04-19 19:18:56.495] [LOG]   Gotchi 99999 is already listed or borrowed by 0xA6AeA7b5f826E97c5e54407ba795579CAB0708a8.
[2022-04-19 19:18:56.496] [LOG]   Gotchi 99999 can't be claimed yet.
[2022-04-19 19:23:56.500] [LOG]   Initiate naive algo...
```
