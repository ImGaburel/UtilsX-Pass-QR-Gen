const passwordGenerator = new PasswordGenerator();
const qrGenerator = new QRGenerator();

const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generatePasswordBtn = document.getElementById('generate-password');
const passwordResult = document.getElementById('password-result');
const copyPasswordBtn = document.getElementById('copy-password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

const qrText = document.getElementById('qr-text');
const qrSize = document.getElementById('qr-size');
const generateQRBtn = document.getElementById('generate-qr');
const qrResult = document.getElementById('qr-result');
const downloadQRBtn = document.getElementById('download-qr');

lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

generatePasswordBtn.addEventListener('click', generatePassword);
copyPasswordBtn.addEventListener('click', copyPassword);
generateQRBtn.addEventListener('click', generateQR);
downloadQRBtn.addEventListener('click', downloadQR);

[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck, lengthSlider].forEach(element => {
    element.addEventListener('change', generatePassword);
});

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const options = {
        uppercase: uppercaseCheck.checked,
        lowercase: lowercaseCheck.checked,
        numbers: numbersCheck.checked,
        symbols: symbolsCheck.checked
    };

    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        passwordResult.value = 'Selecciona al menos una opción';
        updateStrengthMeter('', { level: 'weak', text: 'Sin opciones' });
        return;
    }

    const password = passwordGenerator.generate(length, options);
    passwordResult.value = password;

    const strength = passwordGenerator.calculateStrength(password);
    updateStrengthMeter(password, strength);
    resetCopyButton();
}

function copyPassword() {
    if (!passwordResult.value || passwordResult.value === 'Selecciona al menos una opción') {
        alert('No hay contraseña para copiar');
        return;
    }

    navigator.clipboard.writeText(passwordResult.value).then(() => {
        copyPasswordBtn.classList.add('success');
        copyPasswordBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        
        setTimeout(() => {
            resetCopyButton();
        }, 2000);
    }).catch(() => {
        passwordResult.select();
        document.execCommand('copy');
        alert('Contraseña copiada');
    });
}

function resetCopyButton() {
    copyPasswordBtn.classList.remove('success');
    copyPasswordBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
}

function updateStrengthMeter(password, strength) {
    strengthBar.className = 'strength-bar ' + strength.level;
    strengthText.textContent = 'Seguridad: ' + strength.text;
}

function generateQR() {
    const text = qrText.value.trim();
    const size = qrSize.value;

    if (!text) {
        alert('Ingresa texto o URL para generar el QR');
        return;
    }

    try {
        const canvas = qrGenerator.generate(text, size);
        qrResult.innerHTML = '';
        qrResult.appendChild(canvas);
        downloadQRBtn.style.display = 'inline-flex';
    } catch (error) {
        alert('Error al generar QR: ' + error.message);
    }
}

function downloadQR() {
    try {
        const text = qrText.value.trim();
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `qr-${text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}-${timestamp}.png`;
        
        qrGenerator.downloadQR(filename);
    } catch (error) {
        alert('Error al descargar: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generatePassword();
});

qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQR();
    }
});