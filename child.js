import { readFileSync } from 'node:fs'
import { encrypt } from './helper.js'

try {
  process.stdin.on('data', (data) => {
    const { pubKey, file } = JSON.parse(data.toString())
    const content = readFileSync(file)
    const encryptData = encrypt(pubKey, content)
    process.stdout.write(encryptData.toString('base64'))
  })
} catch (err) {
  console.log(err)
}
