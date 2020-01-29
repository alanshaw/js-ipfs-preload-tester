const Puppeteer = require('puppeteer')
const Http = require('http')
const log = require('debug')('ipfs-preload-tester:runner')
log.browser = require('debug')('ipfs-preload-tester:runner:browser')
const IPFS = require('ipfs')

exports.run = async ({ data, apiAddr, bootstrapAddr }) => {
  log('Creating server for browser...')

  const server = Http.createServer((req, res) => {
    res.write('<doctyle html>')
    res.end()
  })

  const port = await new Promise(resolve => server.listen(() => resolve(server.address().port)))
  const url = `http://localhost:${port}`

  log('Listening on %s', url)

  const browser = await Puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => log.browser(msg.text()))

  await page.goto(url)
  await page.addScriptTag({ url: 'https://unpkg.com/ipfs@0.40.0/dist/index.min.js' })

  const dataCid = await page.evaluate(async ({ data, apiAddr, bootstrapAddr }) => {
    const { Buffer } = window.Ipfs

    console.log(`Using preloader API Address: ${apiAddr}`)
    console.log(`Using preloader Bootstrap Address: ${bootstrapAddr}`)
    console.log('Creating in browser IPFS node...')

    window.ipfs = await window.Ipfs.create({
      preload: {
        enabled: true,
        addresses: [apiAddr]
      },
      config: {
        Bootstrap: [bootstrapAddr]
      }
    })

    console.log(`Adding data: "${data}"`)
    const [{ hash }] = await window.ipfs.add(Buffer.from(data))

    return hash
  }, { data, apiAddr, bootstrapAddr })

  log('Received CID from browser node:', dataCid)

  log('Creating in process IPFS node...')

  const ipfs = await IPFS.create({
    preload: {
      enabled: true,
      addresses: [apiAddr]
    },
    config: {
      Bootstrap: [bootstrapAddr]
    }
  })

  log('Retrieving data for %s...', dataCid)

  const chunks = []
  for await (const chunk of ipfs.cat(dataCid)) {
    log('Got a chunk "%s"', chunk)
    chunks.push(chunk)
  }

  await Promise.all([
    ipfs.stop(),
    browser.close(),
    new Promise(resolve => server.close(resolve))
  ])

  return Buffer.concat(chunks).toString() === data
}
