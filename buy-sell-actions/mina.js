const fs = require('fs')
const path = require('path')
const loggedTxIds = require('../logged-tx-ids.json')
const MinaSheet = require('../services/mina-sheet')
const UsdKrakenSheet = require('../services/usd-kraken-sheet')

function updateLoggedTxIds (logged) {
  fs.writeFileSync(path.join(process.cwd(), 'logged-tx-ids.json'), JSON.stringify(logged, null, 2))
}

module.exports = {
  async buy (config, trade, txId) {
    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'buy',
      trade,
      status: 'start'
    }))

    if (!loggedTxIds.MINA[txId]) {
      // sell usd
      const usdKrakenSheet = new UsdKrakenSheet(config.docId, config.clientEmail, config.privateKey)
      await usdKrakenSheet.insertSellHistory(
        Number(trade.cost) + Number(trade.fee),
        config.usdToIDR,
        0,
        trade.time * 1000
      )
  
      // buy mina
      const minaSheet = new MinaSheet(config.docId, config.clientEmail, config.privateKey)
      await minaSheet.insertBuyHistory(
        trade.vol,
        trade.price * config.usdToIDR,
        trade.fee * config.usdToIDR,
        trade.time * 1000
      )
  
      loggedTxIds.MINA[txId] = 1
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
    console.log(JSON.stringify({
      timestamp: Date.now(),
      action: 'sell',
      trade,
      status: 'start'
    }))

    if (!loggedTxIds.MINA[txId]) {
      // sell mina
      const minaSheet = new MinaSheet(config.docId, config.clientEmail, config.privateKey)
      await minaSheet.insertSellHistory(
        trade.vol,
        trade.price * config.usdToIDR,
        trade.fee * config.usdToIDR,
        trade.time * 1000
      )

      // buy usd
      const usdKrakenSheet = new UsdKrakenSheet(config.docId, config.clientEmail, config.privateKey)
      await usdKrakenSheet.insertBuyHistory(
        Number(trade.cost) - Number(trade.fee),
        config.usdToIDR,
        0,
        trade.time * 1000
      )

      loggedTxIds.MINA[txId] = 1
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
