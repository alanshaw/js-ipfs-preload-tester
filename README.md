# js-ipfs-preload-tester

> Sanity check a preload server is working as expected.

This tester starts two IPFS nodes connected to the same preload node. One node is running in the browser and one node is running in Node.js. This ensures they cannot discover each other or connect to each other locally. The browser node adds some data and the Node.js node retrieves the data. Since these nodes are not connected the data MUST come via the preload node.

## Install

Clone this repo, install dependences and run the test:

```console
git clone https://github.com/alanshaw/js-ipfs-preload-tester.git
cd js-ipfs-preload-tester
npm install
npm start
```

## Usage

```
Sanity check a preload server is working as expected.

Usage: ipfs-preload-tester [options...]

Options:
  -a, --api-addr        Multiaddr of preloader HTTP API
  -b, --bootstrap-addr  Multiaddr of preloader node, including peer ID
  -v, --version         Print version number and exit.
  -h, --help            Print this message and exit.
  -u, --usage           Print this message and exit.
```

The _optional_ CLI args `--api-addr` and `--bootstrap-addr` allow you to specify the preload node to connect to.

Expect to see output like this for a successful run:

```console
$ npm start -- --api-addr=/dns4/node1.preload.ipfs.io/https --bootstrap-addr=/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic

> js-ipfs-preload-tester@0.0.0 start /Users/alan/Code/pl/ipfs/js-ipfs-preload-tester
> node bin "--api-addr=/dns4/node1.preload.ipfs.io/https" "--bootstrap-addr=/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic"

🌎 Using preloader API Address: /dns4/node1.preload.ipfs.io/https
🥾 Using preloader Bootstrap Address: /dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic
💾 Data that will be used in the test: "Test content created on Wed Jan 29 2020 12:33:50 GMT+0000 (Greenwich Mean Time)"
🏃‍♀️ Running the test...
Swarm listening on /ip4/127.0.0.1/tcp/4002
Swarm listening on /ip4/192.168.1.209/tcp/4002
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws
Test execution time: 2.268s
🥳 This preloader is working as expected
```

Note, you can use the `DEBUG` environment variable to get more logging:

```console
$ DEBUG=ipfs-preload-test* npm start

> js-ipfs-preload-tester@0.0.0 start /Users/alan/Code/pl/ipfs/js-ipfs-preload-tester
> node bin

🌎 Using preloader API Address: /dns4/node0.preload.ipfs.io/https
(Use --api-addr arg to change)
🥾 Using preloader Bootstrap Address: /dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic
(Use --bootstrap-addr arg to change)
💾 Data that will be used in the test: "Test content created on Wed Jan 29 2020 12:38:10 GMT+0000 (Greenwich Mean Time)"
🏃‍♀️ Running the test...
  ipfs-preload-tester:runner Creating server for browser... +0ms
  ipfs-preload-tester:runner Listening on http://localhost:55235 +2ms
  ipfs-preload-tester:runner:browser Invalid asm.js: Unexpected token +0ms
  ipfs-preload-tester:runner:browser Using preloader API Address: /dns4/node0.preload.ipfs.io/https +238ms
  ipfs-preload-tester:runner:browser Using preloader Bootstrap Address: /dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic +0ms
  ipfs-preload-tester:runner:browser Creating in browser IPFS node... +0ms
  ipfs-preload-tester:runner:browser Swarm listening on /p2p-circuit/ipfs/QmUCvZY66rJn5pFBmfnPNfjTm86ZupRpUdBitzzFJQNoR1 +470ms
  ipfs-preload-tester:runner:browser Adding data: "Test content created on Wed Jan 29 2020 12:38:10 GMT+0000 (Greenwich Mean Time)" +30ms
  ipfs-preload-tester:runner Received CID from browser node: QmZKxxcFteTgMBH2kzJe3GMrMhRbj6QYPLhmHuiUU3v9mM +1s
  ipfs-preload-tester:runner Creating in process IPFS node... +0ms
Swarm listening on /ip4/127.0.0.1/tcp/4002
Swarm listening on /ip4/192.168.1.209/tcp/4002
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws
  ipfs-preload-tester:runner Retrieving data for QmZKxxcFteTgMBH2kzJe3GMrMhRbj6QYPLhmHuiUU3v9mM... +248ms
  ipfs-preload-tester:runner Got a chunk "Test content created on Wed Jan 29 2020 12:38:10 GMT+0000 (Greenwich Mean Time)" +758ms
Test execution time: 2.418s
🥳 This preloader is working as expected
```
