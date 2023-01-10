import crypto from 'crypto'

export const keyPairGen = (secret) => crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: secret,
  },
})

export const encrypt = (pubKey, content) => crypto.publicEncrypt(pubKey, content)

export const decrypt = (privKey, secret, buffer) => crypto.privateDecrypt({
  key: privKey,
  passphrase: secret,
}, buffer)

export const sign = (algo, content, privKey, secret) => crypto.sign(algo, content, {
  key: privKey,
  passphrase: secret,
})

export const verify = (algo, content, pubKey, sig) => crypto.verify(algo, content, pubKey, sig)
