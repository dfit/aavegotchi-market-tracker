const axios = require('axios');

module.exports = {
  async requestListedGotchis() {
    const query = `{
      erc721Listings(
        first: 1000
      where: {category: 3, cancelled: false, buyer: null}
  ) {
      id
      priceInWei
      seller
      timeCreated
      gotchi {
        id
        name
        baseRarityScore
        modifiedRarityScore
        kinship
        experience
      }
    }
  }`
    const gotchiListedInformation = (await axios.post("https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic", { query: query })).data.data?.erc721Listings
    return gotchiListedInformation === null ? [] : gotchiListedInformation
  },
}
