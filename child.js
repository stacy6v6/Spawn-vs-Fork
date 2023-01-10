import { readFileSync, writeFileSync } from 'node:fs'
import { encrypt } from './helper.js'

try {
  process.stdin.on('data', (data) => {
    const { pubKey, file } = JSON.parse(data.toString())
    const content = readFileSync(file)
    const encryptData = encrypt(pubKey, content)
    writeFileSync('encrypted.txt', encryptData.toString('base64'))
    process.stdout.write('./encrypted.txt')
  })
} catch (err) {
  console.log(err)
}
