module.exports = class Trade {
  constructor ({
    ordertxid,
    postxid,
    pair,
    time,
    type,
    ordertype,
    price,
    cost,
    fee,
    vol,
    margin,
    misc,
  }) {
    this.ordertxid = ordertxid 
    this.postxid = postxid 
    this.pair = pair 
    this.time = time 
    this.type = type 
    this.ordertype = ordertype 
    this.price = price 
    this.cost = cost 
    this.fee = fee 
    this.vol = vol 
    this.margin = margin 
    this.misc = misc 
  }
}
