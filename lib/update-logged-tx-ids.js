const fs = require('fs')
const path = require('path')

module.exports = function updateLoggedTxIds (logged) {
  fs.writeFileSync(path.join(process.cwd(), 'logged-tx-ids.json'), JSON.stringify(logged, null, 2))
}
