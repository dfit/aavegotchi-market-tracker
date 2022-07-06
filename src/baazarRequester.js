const axios = require('axios');

module.exports = {
  async requestListedGotchis() {
    const query = `{
      erc721Listings(
        first: 1000
      where: {category: 3, cancelled: false, buyer: null}
      orderBy: timeCreated
      orderDirection: desc
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
  async requestListedParcels() {
    const query = `{
      erc721Listings(
        first: 1000
      where: {category: 4, cancelled: false, buyer: null}
      orderBy: timeCreated
      orderDirection: desc
  ) {
      id
      priceInWei
      seller
      timeCreated
      parcel {
        id
        size
        parcelId
        district
      }
    }
  }`
    const parcelListedInformation = (await axios.post("https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic", { query: query })).data.data?.erc721Listings
    return parcelListedInformation === null ? [] : parcelListedInformation
  },
}
