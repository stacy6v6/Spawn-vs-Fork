import { readFileSync } from 'node:fs'
import { encrypt } from './helper.js'

try {
  process.on('message', (message) => {
    const { pubKey, file } = JSON.parse(message.toString())
    const content = readFileSync(file)
    const encryptData = encrypt(pubKey, content)
    process.send(encryptData.toString('base64'))
  })
} catch (err) {
  console.log(err)
}
