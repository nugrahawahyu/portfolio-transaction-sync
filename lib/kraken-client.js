const generateSignature = require('./generate-signature')
const axios = require('axios')

module.exports = class KrakenClient {
  constructor (apiKey, apiSecret) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.apiBasePath = 'https://api.kraken.com'
  }

  async getTradeHistoy ({ lastTxId, ofs = 0 }) {
    const nonce = Date.now().toString()
    const path = '/0/private/TradesHistory'
    const params = new URLSearchParams();
    const body = {
      nonce: nonce, 
      type: "all",
      trades: true,
      ...(lastTxId ? { start: lastTxId } : {}),
      ofs
    }

    Object.keys(body).forEach((key) => {
      params.append(key, body[key]);
    })

    const signature = generateSignature(path, body, this.apiSecret, nonce)

    const res = await axios.default.post(`${this.apiBasePath}${path}`, params, {
      headers: {
        'API-Key': this.apiKey,
        'API-Sign': signature
      }
    })

    console.log(JSON.stringify({ config: res.config, responseData: res.data}))

    return res
  }
}
