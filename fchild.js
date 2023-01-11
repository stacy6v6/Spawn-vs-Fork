import { readFileSync, writeFileSync } from 'node:fs'
import { encrypt } from './helper.js'

process.on('message', (message) => {
  try {
    const { pubKey, file } = message
    const content = readFileSync(file)
    const encryptData = encrypt(pubKey, content)
    writeFileSync('encrypted.txt', encryptData.toString('base64'))
    process.send('./encrypted.txt')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})
