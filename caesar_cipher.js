// Function to process text (encrypt or decrypt)
function processText() {
    const text = document.getElementById('text-input').value;
    const shift = parseInt(document.getElementById('shift-key').value);
    const isDecryption = document.getElementById('modeToggle').checked;
    
    const result = caesarCipher(text, isDecryption ? -shift : shift);
    
    // Set the results in the desired format and display the result section
    document.getElementById('result').innerHTML = `
        <p>Shifted Text:</p>
        <p id="result-text">${result}</p>
        <p>Shifted:</p>
        <p id="shift-key">${shift}</p>
    `;
    document.getElementById('result').style.display = 'block';
}

// Caesar cipher function (works for both encryption and decryption)
function caesarCipher(text, shift) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

// Function to reset the form and hide the result
function resetForm() {
    document.getElementById('text-input').value = '';
    document.getElementById('shift-key').value = '';
    
    // Hide the result section
    document.getElementById('result').style.display = 'none';
}

// Function to update UI based on mode
function updateMode() {
    const isDecryption = document.getElementById('modeToggle').checked;
    const formTitle = document.getElementById('form-title');
    const processButton = document.getElementById('process-button');
    
    if (isDecryption) {
        formTitle.innerText = 'Decrypt your text';
        processButton.innerText = 'Decrypt';
    } else {
        formTitle.innerText = 'Encrypt your text';
        processButton.innerText = 'Encrypt';
    }
}

// Event listener for mode toggle
document.getElementById('modeToggle').addEventListener('change', updateMode);

// Initialize the page
document.addEventListener('DOMContentLoaded', updateMode);
