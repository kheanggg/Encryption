$(document).ready(function() {
    // Function to check if a number is prime
    function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    // Function to calculate modular multiplicative inverse
    function modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1n; x < m; x++) {
            if ((BigInt(a) * x) % BigInt(m) === 1n) {
                return x;
            }
        }
        return 1n;
    }

    // Function to perform RSA encryption
    function rsaEncrypt(message, n, e) {
        return message.split('').map(function(char) {
            if (char.match(/[a-zA-Z]/)) {
                var code = char.charCodeAt(0);
                var base = (code >= 65 && code <= 90) ? 65 : 97;
                var index = code - base;
                var encryptedIndex = BigInt(index) ** BigInt(e) % BigInt(n);
                return encryptedIndex.toString();
            }
            return char;
        }).join(' ');
    }

    // Function to perform RSA decryption
    function rsaDecrypt(message, n, d) {
        return message.split(' ').map(function(num) {
            if (num.match(/^\d+$/)) {
                var decryptedIndex = BigInt(num) ** BigInt(d) % BigInt(n);
                var index = Number(decryptedIndex);
                var base = (index >= 0 && index <= 25) ? 65 : 97; // Base ASCII for uppercase or lowercase letters
                return String.fromCharCode(index + base);
            }
            return num;
        }).join('');
    }

    // Toggle switch handler
    $('#modeToggle').on('change', function() {
        let isEncrypting = !this.checked;
        updateUI(isEncrypting);
    });

    // UpdateUI function
    function updateUI(isEncrypting) {
        $('#encryptFields').toggle(isEncrypting);
        $('#decryptFields').toggle(!isEncrypting);
        $('#processButton').text(isEncrypting ? 'Encrypt' : 'Decrypt');
        $('#result p').hide(); // Hide all result elements initially
    }

    $('#rsaForm').on('submit', function(e) {
        e.preventDefault();

        var isEncrypting = !$('#modeToggle').prop('checked');
        var messageEncrypt = $('#messageEncrypt').val();
        var messageDecrypt = $('#messageDecrypt').val();
        var n, e, d;

        $('#pError, #qError').text('');

        if (isEncrypting) {
            var p = BigInt($('#pEncrypt').val());
            var q = BigInt($('#qEncrypt').val());
            e = BigInt($('#eEncrypt').val());

            let isPPrime = isPrime(Number(p));
            let isQPrime = isPrime(Number(q));

            let hasError = false;

            if (!isPPrime) {
                $('#pError').text('Please enter a valid prime number for p.');
                hasError = true;
            }
            if (!isQPrime) {
                $('#qError').text('Please enter a valid prime number for q.');
                hasError = true;
            }

            if (hasError) {
                return;
            }

            n = p * q;
            var phi = (p - 1n) * (q - 1n);
            d = modInverse(e, phi);

            var result = rsaEncrypt(messageEncrypt, n, e);
        } else {
            n = BigInt($('#nDecrypt').val());
            d = BigInt($('#dDecrypt').val());
            var result = rsaDecrypt(messageDecrypt, n, d);
        }

        $('#mode').text(isEncrypting ? 'Encryption' : 'Decryption').parent().show();
        $('#originalMessage').text(isEncrypting ? messageEncrypt : messageDecrypt).parent().show();
        $('#processedMessage').text(result).parent().show();

        if (isEncrypting) {
            $('#publicKeyValue').text(`${n}, ${e}`);
            $('#privateKeyValue').text(`${n}, ${d}`);
            $('#publicKey, #privateKey').show();
            $('#usedKey').hide();
        } else {
            $('#usedKeyValue').text(`${n}, ${d}`);
            $('#usedKey').show();
            $('#publicKey, #privateKey').hide();
        }

        $('#result p:lt(3)').show(); // Show common result elements
    });

    $('#processButton').on('click', function() {
        $('#rsaForm').submit();
    });

    // Reset button handler
    $('#resetButton').on('click', function() {
        $('#pEncrypt, #qEncrypt, #eEncrypt, #messageEncrypt, #nDecrypt, #dDecrypt, #messageDecrypt').val('');
        $('#result').html('');
        $('#pError, #qError').text('');
    });

    updateUI(true);
});