// GCD function
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Extended Euclidean Algorithm
function extendedGcd(a, b) {
    if (a === 0n) {
        return [b, 0n, 1n];
    }
    let [gcdVal, x1, y1] = extendedGcd(b % a, a);
    let x = y1 - (b / a) * x1; // Avoid Math.floor, use BigInt division
    let y = x1;
    return [gcdVal, x, y];
}

// Modular inverse
function modInverse(e, phi) {
    let [gcdVal, x, _] = extendedGcd(BigInt(e), BigInt(phi));
    if (gcdVal !== 1n) {
        throw new Error('Modular inverse does not exist. Ensure e is coprime with phi(n).');
    }
    return ((x % BigInt(phi)) + BigInt(phi)) % BigInt(phi);
}

// Prime check
function isPrime(num) {
    if (num === 2) return true;
    if (num < 2 || num % 2 === 0) return false;
    for (let n = 3; n <= Math.sqrt(num); n += 2) {
        if (num % n === 0) return false;
    }
    return true;
}

// Generate keypair
function generateKeypair(p, q, e) {
    if (!(isPrime(p) && isPrime(q))) {
        throw new Error('Both numbers must be prime.');
    }
    if (p === q) {
        throw new Error('p and q cannot be equal.');
    }

    let n = BigInt(p) * BigInt(q);
    if (n <= 25n) {
        throw new Error('n = p * q must be greater than 25. Please enter larger primes.');
    }

    let phi = BigInt(p - 1) * BigInt(q - 1);
    
    if (e <= 0 || e >= phi) {
        throw new Error('Encryption key e must be a positive integer less than phi(n).');
    }

    if (gcd(e, Number(phi)) !== 1) {
        throw new Error('e must be coprime with phi(n).');
    }

    let d = modInverse(e, phi);

    return [[e, n], [d, n]];
}

// Custom mapping for characters
const charToNum = Object.fromEntries([...Array(26)].map((_, i) => [String.fromCharCode(97 + i), i]));
const numToChar = Object.fromEntries(Object.entries(charToNum).map(([k, v]) => [v, k]));

// Encryption function
function encrypt(pk, plaintext) {
    let [key, n] = pk;
    let mappedValues = plaintext.toLowerCase().replace(/[^a-z]/g, '')
        .split('').map(char => charToNum[char].toString().padStart(2, '0')).join('');
    let cipher = [];

    let step;
    if (n <= 25n) {
        throw new Error("n should be greater than 25.");
    } else if (n <= 2525n) {
        step = 2;
    } else if (n <= 252525n) {
        step = 4;
    } else if (n <= 25252525n) {
        step = 6;
    } else if (n <= 2525252525n) {
        step = 8;
    } else {
        throw new Error("n is out of the supported range.");
    }

    for (let i = 0; i < mappedValues.length; i += step) {
        let segment = BigInt(mappedValues.slice(i, i + step));
        let cipherValue = segment ** BigInt(key) % n;
        cipher.push(cipherValue.toString());
    }

    return cipher;
}

// Decryption function
function decrypt(pk, ciphertext) {
    let [key, n] = pk;
    let plain = [];

    let step;
    if (n <= 25n) {
        throw new Error("n should be greater than 25.");
    } else if (n <= 2525n) {
        step = 2;
    } else if (n <= 252525n) {
        step = 4;
    } else if (n <= 25252525n) {
        step = 6;
    } else if (n <= 2525252525n) {
        step = 8;
    } else {
        throw new Error("n is out of the supported range.");
    }

    for (let cipherValue of ciphertext) {
        let plainValue = BigInt(cipherValue) ** BigInt(key) % n;
        let plainStr = plainValue.toString().padStart(step, '0');
        for (let i = 0; i < plainStr.length; i += 2) {
            let num = parseInt(plainStr.slice(i, i + 2));
            if (num in numToChar) {
                plain.push(numToChar[num]);
            }
        }
    }

    return plain.join('');
}

// Example of running the RSA process
function encryptRSA() {
    const p = parseInt(document.getElementById('prime-p').value);
    const q = parseInt(document.getElementById('prime-q').value);
    const e = parseInt(document.getElementById('encryption-key').value);
    const message = document.getElementById('rsa-message').value;

    try {
        const [publicKey, privateKey] = generateKeypair(p, q, e);
        const encryptedMessage = encrypt(publicKey, message);

        const mappedValues = message.toLowerCase().replace(/[^a-z]/g, '')
            .split('').map(char => charToNum[char].toString().padStart(2, '0')).join('');
            
        document.getElementById('rsa-result').innerHTML = `
            <p>Public Key: (n: ${publicKey[1]}, e: ${publicKey[0]})</p>
            <p>Private Key: (n: ${privateKey[1]}, d: ${privateKey[0]})</p>
            <p>Text to Encrypt: ${message}</p>
            <p>Encrypted Text: ${encryptedMessage.join(', ')}</p>
        `;
    } catch (error) {
        document.getElementById('rsa-result').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Process RSA based on user input
function processRSA() {
    const isDecryption = document.getElementById('modeToggle').checked;
    let message; // Variable to hold the input message

    if (isDecryption) {
        message = document.getElementById('decrypted-message').value.trim();
    } else {
        message = document.getElementById('rsa-message').value.trim();
    }

    // Check if the message input is blank
    if (message === '') {
        // Update the result area with an error message
        document.getElementById('rsa-result').innerHTML = `<p class="error">Please enter a message.</p>`;
        document.getElementById('rsa-result').style.display = 'block'; // Ensure the result area is visible
        return; // Exit the function if the message is blank
    }

    // Clear any previous results before processing
    document.getElementById('rsa-result').innerHTML = '';

    // Proceed with encryption or decryption based on the mode
    if (isDecryption) {
        decryptRSA(); // Call the decrypt function
    } else {
        encryptRSA(); // Call the encrypt function
    }
}






function encryptRSA() {
    const p = parseInt(document.getElementById('prime-p').value);
    const q = parseInt(document.getElementById('prime-q').value);
    const e = parseInt(document.getElementById('encryption-key').value);
    const message = document.getElementById('rsa-message').value;

    console.log('Primes p and q:', p, q);
    console.log('Encryption key e:', e);
    console.log('Message:', message);

    try {
        const [publicKey, privateKey] = generateKeypair(p, q, e);
        console.log('Public Key:', publicKey);
        console.log('Private Key:', privateKey);
    
        const encryptedMessage = encrypt(publicKey, message);
        console.log('Encrypted Message:', encryptedMessage);
    
        const mappedValues = message.toLowerCase().replace(/[^a-z]/g, '')
            .split('').map(char => charToNum[char].toString().padStart(2, '0')).join('');
    
        const outputHTML = `
        <span>Public Key: (n: ${publicKey[1]}, e: ${publicKey[0]})</span>
        <span>Private Key: (n: ${privateKey[1]}, d: ${privateKey[0]})</span>
        <span>Text to Encrypt: ${message}</span>
        <span>Encrypted Text: ${encryptedMessage.join(', ')}</span>
        <br><br>
        `;
        
        
        
    
        document.getElementById('rsa-result').innerHTML = outputHTML;
    
        // Show the result
        document.getElementById('rsa-result').style.display = 'block';
    } catch (error) {
        console.error('Error during encryption:', error);
        document.getElementById('rsa-result').innerHTML = `<p class="error">${error.message}</p>`;
    }
    
}


function decryptRSA() {
    const n = document.getElementById('encryption-key-n').value;
    const d = document.getElementById('private-key-d').value;
    const encryptedMessage = document.getElementById('decrypted-message').value.split(',').map(x => x.trim());

    try {
        const decryptedMessage = decrypt([BigInt(d), BigInt(n)], encryptedMessage);

        document.getElementById('rsa-result').innerHTML = `
            <p>Original Encrypted Message: ${encryptedMessage.join(', ')}</p>
            <p>Decrypted Text: ${decryptedMessage}</p>
            <p>Private Key (n, d): (n: ${n}, d: ${d})</p>
        `;
    } catch (error) {
        document.getElementById('rsa-result').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Function to reset the form and hide the result
function resetForm() {
    document.getElementById('rsa-form').reset();
    document.getElementById('rsa-result').innerHTML = '';
}

// Function to update UI based on mode
function toggleMode() {
    const isDecryption = document.getElementById('modeToggle').checked;
    const encryptForm = document.getElementById('rsa-encrypt-form');
    const decryptForm = document.getElementById('rsa-decrypt-form');
    const formTitle = document.getElementById('form-title');
    const processButton = document.getElementById('process-button');
    
    if (isDecryption) {
        encryptForm.style.display = 'none';
        decryptForm.style.display = 'block';
        formTitle.textContent = 'Decrypt your message';
        processButton.textContent = 'Decrypt';
    } else {
        encryptForm.style.display = 'block';
        decryptForm.style.display = 'none';
        formTitle.textContent = 'Encrypt your message';
        processButton.textContent = 'Encrypt';
    }
}

// Event listener for mode toggle
document.getElementById('modeToggle').addEventListener('change', toggleMode);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    toggleMode();
    document.getElementById('rsa-result').style.display = 'none';
});