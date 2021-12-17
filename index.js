const Puppeteer = require('puppeteer')
const Http = require('http')
const log = require('debug')('ipfs-preload-tester:runner')
log.browser = require('debug')('ipfs-preload-tester:runner:browser')
const IPFS = require('ipfs-core')

exports.run = async ({ data, apiAddr, bootstrapAddr }) => {
  log('Creating server for browser...')

  const server = Http.createServer((req, res) => {
    res.write('<doctyle html>')
    res.end()
  })

  const port = await new Promise(resolve => server.listen(() => resolve(server.address().port)))
  const url = `http://localhost:${port}`

  log('Listening on %s', url)

  const ipfsConfig = {
    preload: {
      enabled: true,
      addresses: [apiAddr]
    },
    config: {
      Bootstrap: [bootstrapAddr]
    }
  }

  log("IPFS configuration:", ipfsConfig)

  log('Creating in process IPFS node...')

  const ipfs = await IPFS.create(ipfsConfig)

  const browser = await Puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => log.browser(msg.text()))

  await page.goto(url)
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/ipfs-core@0.13.0/index.min.js' })

  const dataCid = await page.evaluate(async ({ data, ipfsConfig }) => {
    console.log('Creating in browser IPFS node...')

    const ipfs = await IpfsCore.create(ipfsConfig)

    console.log(`Adding data: "${data}"`)
    const { path } = await ipfs.add(data)

    console.log(`Got CID: `, path)

    return path
  }, { data, ipfsConfig })

  log('Received CID from browser node, retrieving:', dataCid)

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
