const KrakenClient = require('../lib/kraken-client')


module.exports = class Kraken {
  constructor (apiKey, apiSecret) {
    this.client = new KrakenClient(apiKey, apiSecret)
  }

  async getTrades ({ lastTxId, ofs = 0, trades = {} }) {
    const res = await this.client.getTradeHistoy({ lastTxId, ofs })
    if (res.data && res.data.error && res.data.error.length > 0) {
      return Promise.resolve([])
    } else if (res.data) {
      const count = res.data.result.count
      const currentResTrades = res.data.result.trades
      const currentResTradeIds = Object.keys(currentResTrades)
      
      for (let i = 0; i < currentResTradeIds.length; i += 1) {
        trades[currentResTradeIds[i]] = currentResTrades[currentResTradeIds[i]]
      }

      if (Object.keys(trades).length < count) {
        await this.getTrades({ lastTxId, ofs: ofs + 50, trades })
      }

      return Promise.resolve(trades)
    } else {
      return Promise.resolve([])
    }
  }
}
