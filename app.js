/* W O R K I N G  T I T L E 
 * TradingView charts and indicators are the best. I prefer them to Binance's 
 * charts, so I made a bot that uses TradingView indicators, strategies, and
 * alerts. It's simple enough that even a javascript novice can start using 
 * it right away. Working Title was designed to be used as a base for other 
 * projects.
 * 
 * Working Title makes extensive use of Jon Eryck's Node-Binance-API project
 * which can be found here: https://github.com/jaggedsoft/node-binance-api
 * Thanks Jon!
 *****************************************************************************/
// const Binance = require( 'node-binance-api' );
const http = require('http');
const events = require('events');
require('dotenv').config();

// B i n a n c e - N o d e - A P I   O p t i o n s
// const binance = new Binance().options({
//   APIKEY: process.env.BINANCE_APIKEY,
//   APISECRET: process.env.BINANCE_SECRET,
//   useServerTime: true,
//   recvWindow: 1500, // Set a higher recvWindow to increase response timeout
//   verbose: false, // Add extra output when subscribing to WebSockets, etc
//   test: false,
//   reconnect: true
//   // to do: enable Logging
// });
// const symbol = 'BTCUSDT';
// const quantity = 0.0016;
const hostname = '127.0.0.1';
const port = 8000;

// Are we in test mode?
// console.log ("Test Mode: ", binance.getOption('test'));


// KUCOIN
const ccxt = require ('ccxt');
let kucoin    = new ccxt.kucoin ({
      password: process.env.KUCOIN_PASSWORD,
      apiKey: process.env.KUCOIN_APIKEY,
      secret: process.env.KUCOIN_SECRET,
  })

  // const trylimit = async () => {
  //   console.log('try limit order')
  // const order = await kucoin.createOrder ('SUSHI/USDT', 'limit', 'buy', 1, 8)
  // console.log (order)
  // }

  // trylimit()

var eventEmitter = new events.EventEmitter();

eventEmitter.on('error', (err) => {
  console.error(err);
})

eventEmitter.on('buy', async () => {

  const symbol = 'SUSHI/USDT'
  const amount = 1
  const price = 10.89 // USD
  // cost = amount * price = 2 * 9000 = 18000 (USD)

  // note that we don't use createMarketBuyOrder here, instead we use createOrder
  // createMarketBuyOrder will omit the price and will not work when
  // exchange.options['createMarketBuyOrderRequiresPrice'] = true
  const order = await kucoin.createOrder (symbol, 'market', 'buy', amount, price)

  console.log (order)

}) // eventemitter.on('buy')

eventEmitter.on('sell', async () => {

  const symbol = 'SUSHI/USDT'
  const amount = 1
  const price = 10.89 // USD
  const order = await kucoin.createOrder (symbol, 'market', 'sell', amount, price)
  console.log (order)

}) // end eventemitter.on('sell')

//  S T O P
eventEmitter.on('stop', () => {
  
  console.log ('no stop handling yet')
  
  
}) // end eventemitter.on('stop')

const server = http.createServer((req, res) => {
  //const { headers, method, url } = req;
  let body = [];
  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    if(body === 'buy') { 
      eventEmitter.emit('buy'); // <----------------------- BUY
      console.log('--- buy triggered');
    } 
    
    if(body === 'sell') {
      eventEmitter.emit('sell'); // <---------------------- SELL
      console.log('--- sell triggered');
    }
    
    if(body === 'stop') {
      eventEmitter.emit('stop'); // <---------------------- SELL
    }
    console.log(body);
    res.statusCode = 200;
    res.end();
    }
  )}
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});