module.exports = class Trade {
  constructor ({
    buyLastRowCell,
    buyDateColumn,
    buyAmountColumn,
    buyFeeColumn,
    sellLastRowCell,
    sellDateColumn,
    sellAmountColumn,
    sellFeeColumn,
  }) {
    this.buyLastRowCell = buyLastRowCell
    this.buyDateColumn = buyDateColumn
    this.buyAmountColumn = buyAmountColumn
    this.buyFeeColumn = buyFeeColumn
    this.sellLastRowCell = sellLastRowCell
    this.sellDateColumn = sellDateColumn
    this.sellAmountColumn = sellAmountColumn
    this.sellFeeColumn = sellFeeColumn
  }
}
