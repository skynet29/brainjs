(function () {

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()


    function toBase64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    }
    
    function fromBase64(buffer) {
        return Uint8Array.from(atob(buffer), c => c.charCodeAt(0))
    }
  

    async function PBKDF2(
        password, salt, iterations,
        length, hash, algorithm = 'AES-CBC') {

        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        )

        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations,
                hash
            },
            keyMaterial,
            { name: algorithm, length },
            false, // we don't need to export our key!!!
            ['encrypt', 'decrypt']
        )
    }


    async function encrypt(password, text) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16))
        const iv = window.crypto.getRandomValues(new Uint8Array(16))
        const plain_text = encoder.encode(text)
        const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256')
        
        const encrypted = await window.crypto.subtle.encrypt(
            {name: "AES-CBC", iv },
            key,
            plain_text
          )    
          
        return toBase64([
            ...salt,
            ...iv,
            ...new Uint8Array(encrypted)
          ])

    }

    async function decrypt(password, data) {
        const salt_len = iv_len = 16

        const encrypted = fromBase64(data)
        
        const salt = encrypted.slice(0, salt_len)
        const iv = encrypted.slice(0+salt_len, salt_len+iv_len)
        const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256')
        
        const decrypted = await window.crypto.subtle.decrypt(
          { name: "AES-CBC", iv },
          key,
          encrypted.slice(salt_len + iv_len)
        )

        return decoder.decode(decrypted)
    }

    


    $$.crypto = {
        encrypt,
        decrypt
    }

})()
