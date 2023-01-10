import { readFileSync } from 'node:fs'
import { fork } from 'node:child_process'
import * as dotenv from 'dotenv'
import {
  decrypt, keyPairGen, sign, verify,
} from './helper.js'

dotenv.config()

try {
  const secret = process.env.SECRET
  const algo = 'SHA256'
  const { publicKey, privateKey } = keyPairGen(secret)
  const fname = './plaintext.txt'
  const content = readFileSync(fname)
  const sig = sign(algo, content, privateKey, secret)
  const child = fork('./fchild.js')
  const sendObj = {
    pubKey: publicKey,
    file: fname,
  }

  child.send(JSON.stringify(sendObj))

  child.on('message', (message) => {
    const buf = Buffer.from(message.toString(), 'base64')
    const decrypted = decrypt(privateKey, secret, buf)
    const verified = verify(algo, decrypted, publicKey, sig) ? decrypted.toString() : 'Invalid Message'
    console.table([{
      time: process.uptime(),
      message: verified,
      memoryConsumed: process.memoryUsage().external,
    }])
    process.exit(0)
  })
  process.on('error', (error) => {
    console.log(error)
  })
} catch (err) {
  console.log(err.message)
}
