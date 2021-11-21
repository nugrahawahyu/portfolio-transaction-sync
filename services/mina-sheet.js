const initGdoc = require('../lib/init-gdoc')

module.exports = class MinaSheet {
  constructor (docId, clientEmail, privateKey) {
    this.initGdoc = initGdoc(docId, clientEmail, privateKey)
    this.sheetName = 'MINA'
    this.doc = null
  }

  async insertBuyHistory (amount, price, fee, time) {
    if (!this.doc) {
      this.doc = await this.initGdoc
    }
    const doc = this.doc
    const sheet = doc.sheetsByTitle[this.sheetName]
    await sheet.loadCells('G:G');
    const buyEntryNextRow = sheet.cellStats.nonEmpty + 1

    await sheet.loadCells(`G${buyEntryNextRow}:J${buyEntryNextRow}`);
    
    const newBuyEntryDateCell = sheet.getCellByA1(`G${buyEntryNextRow}`)
    const newBuyEntryAmountCell = sheet.getCellByA1(`H${buyEntryNextRow}`)
    const newBuyEntryPriceCell = sheet.getCellByA1(`I${buyEntryNextRow}`)
    const newBuyEntryFeeCell = sheet.getCellByA1(`J${buyEntryNextRow}`)

    newBuyEntryDateCell.value = new Date(time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    newBuyEntryAmountCell.value = amount
    newBuyEntryPriceCell.value = price
    newBuyEntryFeeCell.value = fee

    await Promise.all([
      newBuyEntryDateCell.save(),
      newBuyEntryAmountCell.save(),
      newBuyEntryPriceCell.save(),
      newBuyEntryFeeCell.save(),
    ])
  }

  async insertSellHistory (amount, price, fee, time) {
    if (!this.doc) {
      this.doc = await this.initGdoc
    }
    const doc = this.doc
    const sheet = doc.sheetsByTitle[this.sheetName]
    await sheet.loadCells('A:A');
    const sellEntryNextRow = sheet.cellStats.nonEmpty + 1

    await sheet.loadCells(`A${sellEntryNextRow}:D${sellEntryNextRow}`);
    
    const newSellEntryDateCell = sheet.getCellByA1(`A${sellEntryNextRow}`)
    const newSellEntryAmountCell = sheet.getCellByA1(`B${sellEntryNextRow}`)
    const newSellEntryPriceCell = sheet.getCellByA1(`C${sellEntryNextRow}`)
    const newSellEntryFeeCell = sheet.getCellByA1(`D${sellEntryNextRow}`)

    newSellEntryDateCell.value = new Date(time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    newSellEntryAmountCell.value = amount
    newSellEntryPriceCell.value = price
    newSellEntryFeeCell.value = fee

    await Promise.all([
      newSellEntryDateCell.save(),
      newSellEntryAmountCell.save(),
      newSellEntryPriceCell.save(),
      newSellEntryFeeCell.save(),
    ])
  }
}
