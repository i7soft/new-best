
console.log(arguments);

const utils = require('../request/utils')

console.log('hello worker')

worker.postMessage({
  msg: 'hello from worker: ' + utils.test(),
  buffer: utils.str2ab('hello arrayBuffer from worker')
})

worker.onMessage((msg) => {
  console.log('[Worker] on appservice message', msg)
  const buffer = msg.buffer
  console.log('[Worker] on appservice buffer length ', buffer)
  console.log('[Worker] on appservice buffer', utils.ab2str(buffer))
})