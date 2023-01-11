import { readFileSync, writeFileSync } from 'node:fs'
import { encrypt } from './helper.js'

try {
  process.on('message', (message) => {
    const { pubKey, file } = message
    const content = readFileSync(file)
    const encryptData = encrypt(pubKey, content)
    writeFileSync('encrypted.txt', encryptData.toString('base64'))
    process.send('./encrypted.txt')
  })
} catch (err) {
  console.log(err)
}
