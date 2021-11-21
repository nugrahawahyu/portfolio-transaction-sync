const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const puppeteer = require('puppeteer-extra')
const wait = require('../lib/wait')

puppeteer.use(AdblockerPlugin())
puppeteer.use(StealthPlugin())

/**
 * Parse a localized number to a float.
 * @param {string} stringNumber - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
 function parseLocaleNumber(stringNumber, locale) {
  var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
  var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');

  return Number(stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
  );
}

module.exports = class GoogleSearch {
  constructor (locale) {
    this.locale = locale
  }

  async getPriceFromGoogle (query, selector, takeScreenShot = false, attempt = 1) {
    const MAX_RETRY = 3
    const BEFORE_RETRY_WAIT_TIME = 1000
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--lang=id'],
      executablePath: process.env.CHROMIUM_PATH,
    });
    const page = await browser.newPage();
    try {
      console.log(new Date(), `getPrice ${query} start (attempt=${attempt})`);
      await page.setDefaultNavigationTimeout(30000);
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'id'
      });
      await page.goto(`https://www.google.com/search?q=${query}`)
      const element = await page.$(selector)
      const value = await page.evaluate(el => el.textContent, element)
      const price = parseLocaleNumber(value, this.locale)
      if (takeScreenShot) await page.screenshot({ path: path.join(__dirname, `screenshots/google-${(new Date()).getTime()}.jpeg`) });
      await page.close()
      console.log(new Date(), `getPrice ${query} done (price=${price})`);
      return price
    } catch (e) {
      await page.close()
      if (attempt < MAX_RETRY) {
        await wait(BEFORE_RETRY_WAIT_TIME)
        return this.getPriceFromGoogle(query, selector, takeScreenShot, attempt + 1)
      }
      console.error(new Date(), query ,e)
      return -1
    } finally {
      await browser.close();
    }
  }
}
