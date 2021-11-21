require('dotenv').config()
const fs = require('fs')
const buySellActions = require('./buy-sell-actions')
const Trade = require('./models/trade')
const pairSheetMap = require('./pair-sheet-map.json')
const Kraken = require('./services/kraken')
const GoogleSearch = require('./services/google-search')
const wait = require('./lib/wait')

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const locale = process.env.LOCALE || 'id'
const docId = process.env.DOC_ID
const clientEmail = process.env.CLIENT_EMAIL
const privateKey = process.env.PRIVATE_KEY

const SLEEP_DURATION = 10000

const kraken = new Kraken(apiKey, apiSecret)
const googleSearch = new GoogleSearch(locale)

const config = {
  apiKey,
  apiSecret,
  locale,
  docId,
  clientEmail,
  privateKey,
  usdToIDR: undefined
}


function updateLastTxId (txId) {
  fs.writeFileSync('./last-tx-id.json', JSON.stringify({
    "tx-id": txId
  }, null, 2))
}

async function main () {
  const lastTxId = require('./last-tx-id.json')['tx-id']
  const usdToIDR = await googleSearch.getPriceFromGoogle('usd+to+idr', 'span[data-precision="2"]')
  const trades = await kraken.getTrades({ lastTxId })
  const txIds = Object.keys(trades)

  config.usdToIDR = usdToIDR

  if (txIds.length > 0) {
    for (let i = 0; i < txIds.length; i++) {
      const txId = txIds[i]
      const trade = new Trade(trades[txId])
      const sheetName = pairSheetMap[trade.pair]

      if (sheetName && buySellActions[sheetName]) {
        await buySellActions[sheetName][trade.type](config, trade, txId)
      } else {
        console.warn(`Invalid sheet name: ${sheetName}`)
      }
    }
    updateLastTxId(txIds[0])
  }

  return Promise.resolve()
}

async function loop () {
  while (true) {
    try {
      await main()
    } catch (e) {
      console.error(JSON.stringify({error: e}))
    } finally {
      console.log(`sleeping for ${SLEEP_DURATION} ms`)
      await wait(SLEEP_DURATION)
      continue
    }
  }
}

loop()
