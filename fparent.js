import { freemem } from 'node:os'
import { readFileSync } from 'node:fs'
import { fork } from 'node:child_process'
import * as dotenv from 'dotenv'
import {
  decrypt, keyPairGen, sign, verify,
} from './helper.js'

const startMem = freemem()
dotenv.config()

try {
  const secret = process.env.SECRET
  const algo = 'SHA256'
  const { publicKey, privateKey } = keyPairGen(secret)
  const filePath = './plaintext.txt'
  const content = readFileSync(filePath)
  const signature = sign(algo, content, privateKey, secret)
  const child = fork('./fchild.js')
  const sendObj = {
    pubKey: publicKey,
    file: filePath,
  }

  child.on('message', (message) => {
    const childFile = readFileSync(message)
    const buf = Buffer.from(childFile.toString(), 'base64')
    const decrypted = decrypt(privateKey, secret, buf)
    const decryptedMessage = verify(algo, decrypted, publicKey, signature) ? decrypted.toString() : 'Invalid Message'
    console.table([{
      time: process.uptime(),
      message: decryptedMessage,
      memoryConsumed: (startMem - freemem()) / 1048576,
    }])
    process.exit(0)
  })
  process.on('error', (error) => {
    console.log(error)
  })
  child.send(sendObj)
} catch (err) {
  console.log(err.message)
}
