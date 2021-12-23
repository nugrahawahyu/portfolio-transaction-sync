const updateLoggedTxIds = require('../lib/update-logged-tx-ids')
const SheetService = require('../services/doge-sheet')
const UsdKrakenSheet = require('../services/usd-kraken-sheet')

const sheetName = 'DOGE'

module.exports = {
  async buy (config, trade, txId) {
    const loggedTxIds = require('../logged-tx-ids.json')

    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'buy',
      trade,
      status: 'start'
    }))

    if (!loggedTxIds[sheetName][txId]) {
      // sell usd
      const usdKrakenSheet = new UsdKrakenSheet(config.docId, config.clientEmail, config.privateKey)
      await usdKrakenSheet.insertSellHistory(
        Number(trade.cost) + Number(trade.fee),
        config.usdToIDR,
        0,
        trade.time * 1000,
        txId
      )
  
      // buy doge
      const sheetService = new SheetService(config.docId, config.clientEmail, config.privateKey)
      await sheetService.insertBuyHistory(
        trade.vol,
        trade.price * config.usdToIDR,
        trade.fee * config.usdToIDR,
        trade.time * 1000,
        txId
      )
  
      loggedTxIds[sheetName][txId] = 1
      updateLoggedTxIds(loggedTxIds)
    }

    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'buy',
      trade,
      status: 'done'
    }))
  },

  async sell (config, trade, txId) {
    const loggedTxIds = require('../logged-tx-ids.json')

    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'sell',
      trade,
      status: 'start'
    }))

    if (!loggedTxIds[sheetName][txId]) {
      // sell doge
      const sheetService = new SheetService(config.docId, config.clientEmail, config.privateKey)
      await sheetService.insertSellHistory(
        trade.vol,
        trade.price * config.usdToIDR,
        trade.fee * config.usdToIDR,
        trade.time * 1000,
        txId
      )

      // buy usd
      const usdKrakenSheet = new UsdKrakenSheet(config.docId, config.clientEmail, config.privateKey)
      await usdKrakenSheet.insertBuyHistory(
        Number(trade.cost) - Number(trade.fee),
        config.usdToIDR,
        0,
        trade.time * 1000,
        txId
      )

      loggedTxIds[sheetName][txId] = 1
      updateLoggedTxIds(loggedTxIds)
    }

    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'sell',
      trade,
      status: 'done'
    }))
  }
}
